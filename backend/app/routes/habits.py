from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Habit
from app.schemas import habit_schema, habits_schema

bp = Blueprint('habits', __name__, url_prefix='/api/habits')


@bp.route('', methods=['GET'])
def get_habits():
    """Get all active habits"""
    habits = Habit.query.filter_by(is_active=True).all()
    return jsonify(habits_schema.dump(habits))


@bp.route('', methods=['POST'])
def create_habit():
    """Create a new habit"""
    data = request.get_json()
    habit = Habit(
        name=data['name'],
        description=data.get('description', ''),
        frequency=data.get('frequency', 'daily'),
        target_days=data.get('target_days', 7),
        color=data.get('color', '#D4A957')
    )
    db.session.add(habit)
    db.session.commit()
    return jsonify(habit_schema.dump(habit)), 201


@bp.route('/<int:id>', methods=['PUT'])
def update_habit(id):
    """Update a habit"""
    habit = Habit.query.get_or_404(id)
    data = request.get_json()

    if 'name' in data:
        habit.name = data['name']
    if 'description' in data:
        habit.description = data['description']
    if 'frequency' in data:
        habit.frequency = data['frequency']
    if 'target_days' in data:
        habit.target_days = data['target_days']
    if 'color' in data:
        habit.color = data['color']

    db.session.commit()
    return jsonify(habit_schema.dump(habit))


@bp.route('/<int:id>', methods=['DELETE'])
def delete_habit(id):
    """Soft delete a habit (mark as inactive)"""
    habit = Habit.query.get_or_404(id)
    habit.is_active = False
    db.session.commit()
    return '', 204
