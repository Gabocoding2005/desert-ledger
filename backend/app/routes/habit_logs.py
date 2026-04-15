from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import HabitLog
from app.schemas import habit_log_schema, habit_logs_schema
from datetime import datetime

bp = Blueprint('habit_logs', __name__, url_prefix='/api/habits')


@bp.route('/<int:habit_id>/logs', methods=['GET'])
def get_habit_logs(habit_id):
    """Get logs for a specific habit"""
    month = request.args.get('month', type=int)
    year = request.args.get('year', type=int)

    query = HabitLog.query.filter_by(habit_id=habit_id)

    if month and year:
        query = query.filter(
            db.extract('month', HabitLog.date) == month,
            db.extract('year', HabitLog.date) == year
        )

    logs = query.order_by(HabitLog.date.desc()).all()
    return jsonify(habit_logs_schema.dump(logs))


@bp.route('/<int:habit_id>/logs', methods=['POST'])
def toggle_habit_log(habit_id):
    """Toggle a habit log for a specific date"""
    data = request.get_json()
    log_date = datetime.fromisoformat(data['date']).date() if 'date' in data else datetime.now().date()

    # Check if log exists
    existing = HabitLog.query.filter_by(habit_id=habit_id, date=log_date).first()

    if existing:
        # Toggle or delete
        if existing.completed:
            db.session.delete(existing)
            db.session.commit()
            return jsonify({'message': 'Log removed'}), 200
        else:
            existing.completed = True
            db.session.commit()
            return jsonify(habit_log_schema.dump(existing))

    # Create new log
    log = HabitLog(
        habit_id=habit_id,
        date=log_date,
        completed=True,
        notes=data.get('notes', '')
    )
    db.session.add(log)
    db.session.commit()
    return jsonify(habit_log_schema.dump(log)), 201
