from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import Category
from app.schemas import category_schema, categories_schema

bp = Blueprint('categories', __name__, url_prefix='/api/categories')


@bp.route('', methods=['GET'])
def get_categories():
    """Get all categories"""
    categories = Category.query.all()
    return jsonify(categories_schema.dump(categories))


@bp.route('', methods=['POST'])
def create_category():
    """Create a new category"""
    data = request.get_json()
    category = Category(
        name=data['name'],
        type=data['type'],
        icon=data.get('icon', '💰'),
        color=data.get('color', '#D4A957')
    )
    db.session.add(category)
    db.session.commit()
    return jsonify(category_schema.dump(category)), 201


@bp.route('/<int:id>', methods=['PUT'])
def update_category(id):
    """Update a category"""
    category = Category.query.get_or_404(id)
    data = request.get_json()

    if 'name' in data:
        category.name = data['name']
    if 'type' in data:
        category.type = data['type']
    if 'icon' in data:
        category.icon = data['icon']
    if 'color' in data:
        category.color = data['color']

    db.session.commit()
    return jsonify(category_schema.dump(category))


@bp.route('/<int:id>', methods=['DELETE'])
def delete_category(id):
    """Delete a category (only if no transactions)"""
    category = Category.query.get_or_404(id)

    if category.transactions:
        return jsonify({'error': 'Cannot delete category with existing transactions'}), 400

    db.session.delete(category)
    db.session.commit()
    return '', 204
