from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Transaction, Category, HabitLog, Habit
from sqlalchemy import func, extract
from datetime import datetime, timedelta

bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')


@bp.route('/summary', methods=['GET'])
def get_summary():
    """Get financial summary for current month"""
    now = datetime.now()
    month = request.args.get('month', now.month, type=int)
    year = request.args.get('year', now.year, type=int)

    # Total income
    total_income = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.type == 'income',
        extract('month', Transaction.date) == month,
        extract('year', Transaction.date) == year
    ).scalar() or 0

    # Total expenses
    total_expenses = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.type == 'expense',
        extract('month', Transaction.date) == month,
        extract('year', Transaction.date) == year
    ).scalar() or 0

    # Top spending categories
    top_categories = db.session.query(
        Category.name,
        Category.icon,
        Category.color,
        func.sum(Transaction.amount).label('total')
    ).join(Transaction).filter(
        Transaction.type == 'expense',
        extract('month', Transaction.date) == month,
        extract('year', Transaction.date) == year
    ).group_by(Category.id).order_by(func.sum(Transaction.amount).desc()).limit(5).all()

    return jsonify({
        'balance': total_income - total_expenses,
        'income': total_income,
        'expenses': total_expenses,
        'top_categories': [
            {'name': c.name, 'icon': c.icon, 'color': c.color, 'total': c.total}
            for c in top_categories
        ]
    })


@bp.route('/trends', methods=['GET'])
def get_trends():
    """Get spending trends for last 6 months"""
    now = datetime.now()
    trends = []

    for i in range(5, -1, -1):
        target_date = now - timedelta(days=i*30)
        month = target_date.month
        year = target_date.year

        total_expenses = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.type == 'expense',
            extract('month', Transaction.date) == month,
            extract('year', Transaction.date) == year
        ).scalar() or 0

        trends.append({
            'month': month,
            'year': year,
            'total': total_expenses
        })

    return jsonify(trends)


@bp.route('/habits', methods=['GET'])
def get_habits_summary():
    """Get habits completion summary"""
    habits = Habit.query.filter_by(is_active=True).all()
    today = datetime.now().date()
    summary = []

    for habit in habits:
        # Get current streak
        streak = 0
        check_date = today
        while True:
            log = HabitLog.query.filter_by(habit_id=habit.id, date=check_date, completed=True).first()
            if log:
                streak += 1
                check_date = check_date - timedelta(days=1)
            else:
                break

        # Get completion percentage for current month
        month_logs = HabitLog.query.filter(
            HabitLog.habit_id == habit.id,
            extract('month', HabitLog.date) == today.month,
            extract('year', HabitLog.date) == today.year,
            HabitLog.completed == True
        ).count()

        # Days in month so far
        days_passed = today.day

        completion_rate = (month_logs / days_passed * 100) if days_passed > 0 else 0

        summary.append({
            'id': habit.id,
            'name': habit.name,
            'color': habit.color,
            'streak': streak,
            'completion_rate': round(completion_rate, 1)
        })

    return jsonify(summary)
