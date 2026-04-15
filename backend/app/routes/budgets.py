from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Budget
from app.schemas import budget_schema, budgets_schema

bp = Blueprint('budgets', __name__, url_prefix='/api/budgets')


@bp.route('', methods=['GET'])
def get_budgets():
    """Get budgets for a specific month/year"""
    month = request.args.get('month', type=int)
    year = request.args.get('year', type=int)

    query = Budget.query
    if month and year:
        query = query.filter_by(month=month, year=year)

    budgets = query.all()
    return jsonify(budgets_schema.dump(budgets))


@bp.route('', methods=['POST'])
def create_or_update_budget():
    """Create or update a budget"""
    data = request.get_json()

    # Check if budget already exists
    existing = Budget.query.filter_by(
        category_id=data['category_id'],
        month=data['month'],
        year=data['year']
    ).first()

    if existing:
        existing.limit_amount = data['limit_amount']
        db.session.commit()
        return jsonify(budget_schema.dump(existing))

    budget = Budget(
        category_id=data['category_id'],
        month=data['month'],
        year=data['year'],
        limit_amount=data['limit_amount']
    )
    db.session.add(budget)
    db.session.commit()
    return jsonify(budget_schema.dump(budget)), 201


@bp.route('/<int:id>', methods=['DELETE'])
def delete_budget(id):
    """Delete a budget"""
    budget = Budget.query.get_or_404(id)
    db.session.delete(budget)
    db.session.commit()
    return '', 204
