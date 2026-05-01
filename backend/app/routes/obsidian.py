import calendar
from datetime import datetime, timedelta
from pathlib import Path
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Transaction, Category, HabitLog, Habit, Recipe
from sqlalchemy import func, extract

bp = Blueprint('obsidian', __name__, url_prefix='/api/obsidian')

# Windows paths like C:\Users\User\... are mounted at /mnt/host inside Docker
_WIN_PREFIXES = [
    'C:\\Users\\User', 'c:\\Users\\User',
    'C:/Users/User',  'c:/Users/User',
]

def _translate_path(path: str) -> str:
    p = path.strip()
    for prefix in _WIN_PREFIXES:
        if p.startswith(prefix):
            rest = p[len(prefix):].replace('\\', '/').lstrip('/')
            return '/mnt/host/' + rest if rest else '/mnt/host'
    return p

MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
]


def _subdir(vault_path, *parts):
    path = Path(vault_path).joinpath(*parts)
    path.mkdir(parents=True, exist_ok=True)
    return path


def _safe_name(text):
    return ''.join(c for c in text if c.isalnum() or c in ' -_').strip()


@bp.route('/test', methods=['POST'])
def test_path():
    vault_path = (request.get_json() or {}).get('vault_path', '').strip()
    if not vault_path:
        return jsonify({'ok': False, 'error': 'Ruta vacía'}), 400
    p = Path(_translate_path(vault_path))
    if not p.exists():
        return jsonify({'ok': False, 'error': 'La ruta no existe'}), 400
    if not p.is_dir():
        return jsonify({'ok': False, 'error': 'No es una carpeta'}), 400
    return jsonify({'ok': True})


@bp.route('/export-report', methods=['POST'])
def export_report():
    data = request.get_json() or {}
    vault_path = data.get('vault_path', '').strip()
    month = data.get('month')
    year = data.get('year')

    if not vault_path:
        return jsonify({'error': 'vault_path requerido'}), 400
    if not month or not year:
        return jsonify({'error': 'month y year son requeridos'}), 400
    vault_path = _translate_path(vault_path)
    if not Path(vault_path).exists():
        return jsonify({'error': 'La ruta del vault no existe'}), 400

    total_income = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.type == 'income',
        extract('month', Transaction.date) == month,
        extract('year', Transaction.date) == year,
    ).scalar() or 0

    total_expenses = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.type == 'expense',
        extract('month', Transaction.date) == month,
        extract('year', Transaction.date) == year,
    ).scalar() or 0

    top_categories = db.session.query(
        Category.name,
        func.sum(Transaction.amount).label('total'),
    ).join(Transaction).filter(
        Transaction.type == 'expense',
        extract('month', Transaction.date) == month,
        extract('year', Transaction.date) == year,
    ).group_by(Category.id).order_by(func.sum(Transaction.amount).desc()).limit(5).all()

    habits = Habit.query.filter_by(is_active=True).all()
    today = datetime.now().date()
    days_in_month = calendar.monthrange(year, month)[1]
    habit_rows = []

    for habit in habits:
        month_logs = HabitLog.query.filter(
            HabitLog.habit_id == habit.id,
            extract('month', HabitLog.date) == month,
            extract('year', HabitLog.date) == year,
            HabitLog.completed == True,
        ).count()

        streak, check = 0, today
        while streak < 3650 and HabitLog.query.filter_by(habit_id=habit.id, date=check, completed=True).first():
            streak += 1
            check = check - timedelta(days=1)

        rate = round(month_logs / days_in_month * 100, 1)
        habit_rows.append((habit.name, rate, streak))

    balance = total_income - total_expenses
    month_name = MONTH_NAMES[month - 1]
    balance_icon = '💚' if balance >= 0 else '🔴'

    md = f"""---
type: monthly-report
period: {year}-{month:02d}
tags: [finanzas, desert-ledger, reporte]
---

# Reporte Mensual — {month_name} {year}

## Resumen Financiero

| | Monto |
|---|---|
| 💚 Ingresos | ${total_income:,.2f} |
| 🔴 Gastos | ${total_expenses:,.2f} |
| {balance_icon} Balance | ${balance:,.2f} |

## Top Categorías de Gasto

| Categoría | Gastado |
|---|---|
"""
    for cat_name, total in top_categories:
        md += f'| {cat_name} | ${total:,.2f} |\n'

    md += '\n## Hábitos del Mes\n\n| Hábito | Cumplimiento | Racha |\n|---|---|---|\n'
    for name, rate, streak in habit_rows:
        streak_str = f'🔥 {streak} días' if streak > 0 else '—'
        md += f'| {name} | {rate}% | {streak_str} |\n'

    md += f'\n---\n*Exportado desde Desert Ledger el {datetime.now().strftime("%Y-%m-%d %H:%M")}*\n'

    out_dir = _subdir(vault_path, 'Desert Ledger', 'Reportes')
    filepath = out_dir / f'{year}-{month:02d} {month_name}.md'
    filepath.write_text(md, encoding='utf-8')

    return jsonify({'ok': True, 'path': str(filepath)})


@bp.route('/export-recipe/<int:recipe_id>', methods=['POST'])
def export_recipe(recipe_id):
    vault_path = _translate_path(((request.get_json() or {}).get('vault_path', '')).strip())

    if not vault_path:
        return jsonify({'error': 'vault_path requerido'}), 400
    if not Path(vault_path).exists():
        return jsonify({'error': 'La ruta del vault no existe'}), 400

    recipe = Recipe.query.get_or_404(recipe_id)

    tags_yaml  = ', '.join(recipe.tags or [])
    ingredients = '\n'.join(f'- {i}' for i in (recipe.ingredients or []))
    steps       = '\n'.join(f'{i+1}. {s}' for i, s in enumerate(recipe.steps or []))

    meta_parts = []
    if recipe.prep_time: meta_parts.append(f'**Prep:** {recipe.prep_time} min')
    if recipe.cook_time: meta_parts.append(f'**Cook:** {recipe.cook_time} min')
    if recipe.servings:  meta_parts.append(f'**Porciones:** {recipe.servings}')
    meta = ' | '.join(meta_parts)

    md = f"""---
type: recipe
tags: [receta, desert-ledger{', ' + tags_yaml if tags_yaml else ''}]
prep_time: {recipe.prep_time or ''}
cook_time: {recipe.cook_time or ''}
servings: {recipe.servings or ''}
---

# {recipe.title}
"""
    if recipe.description:
        md += f'\n> {recipe.description}\n'
    if meta:
        md += f'\n{meta}\n'

    md += f'\n## Ingredientes\n\n{ingredients}\n\n## Pasos\n\n{steps}\n'

    if recipe.tags:
        md += '\n## Tags\n\n' + '\n'.join(f'- {t}' for t in recipe.tags) + '\n'

    md += f'\n---\n*Exportado desde Desert Ledger el {datetime.now().strftime("%Y-%m-%d %H:%M")}*\n'

    out_dir = _subdir(vault_path, 'Desert Ledger', 'Recetas')
    filename = f'{_safe_name(recipe.title)}.md'
    filepath = out_dir / filename
    filepath.write_text(md, encoding='utf-8')

    return jsonify({'ok': True, 'path': str(filepath)})
