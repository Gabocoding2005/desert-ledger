from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Transaction
from app.schemas import transaction_schema, transactions_schema
from datetime import datetime

bp = Blueprint('transactions', __name__, url_prefix='/api/transactions')


@bp.route('', methods=['GET'])
def get_transactions():
    """Get all transactions with optional filters"""
    query = Transaction.query

    # Filter by month/year
    month = request.args.get('month', type=int)
    year = request.args.get('year', type=int)
    if month and year:
        query = query.filter(
            db.extract('month', Transaction.date) == month,
            db.extract('year', Transaction.date) == year
        )

    # Filter by category
    category_id = request.args.get('category_id', type=int)
    if category_id:
        query = query.filter_by(category_id=category_id)

    # Filter by type
    transaction_type = request.args.get('type')
    if transaction_type:
        query = query.filter_by(type=transaction_type)

    transactions = query.order_by(Transaction.date.desc()).all()
    return jsonify(transactions_schema.dump(transactions))


@bp.route('', methods=['POST'])
def create_transaction():
    """Create a new transaction"""
    data = request.get_json()
    transaction = Transaction(
        amount=data['amount'],
        type=data['type'],
        description=data.get('description', ''),
        date=datetime.fromisoformat(data['date']).date() if 'date' in data else datetime.now().date(),
        category_id=data['category_id']
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify(transaction_schema.dump(transaction)), 201


@bp.route('/<int:id>', methods=['PUT'])
def update_transaction(id):
    """Update a transaction"""
    transaction = Transaction.query.get_or_404(id)
    data = request.get_json()

    if 'amount' in data:
        transaction.amount = data['amount']
    if 'type' in data:
        transaction.type = data['type']
    if 'description' in data:
        transaction.description = data['description']
    if 'date' in data:
        transaction.date = datetime.fromisoformat(data['date']).date()
    if 'category_id' in data:
        transaction.category_id = data['category_id']

    db.session.commit()
    return jsonify(transaction_schema.dump(transaction))


@bp.route('/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    """Delete a transaction"""
    transaction = Transaction.query.get_or_404(id)
    db.session.delete(transaction)
    db.session.commit()
    return '', 204
