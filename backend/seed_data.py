"""
Seed script to populate database with default categories
Run with: python seed_data.py
"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from app import create_app, db
from app.models import Category

app = create_app()

DEFAULT_CATEGORIES = [
    # Income categories
    {'name': 'Salary', 'type': 'income', 'icon': '💼', 'color': '#4A7C59'},
    {'name': 'Freelance', 'type': 'income', 'icon': '💻', 'color': '#6B7F5E'},
    {'name': 'Investment', 'type': 'income', 'icon': '📈', 'color': '#7CAFC4'},
    {'name': 'Other Income', 'type': 'income', 'icon': '💰', 'color': '#D4A957'},

    # Expense categories
    {'name': 'Groceries', 'type': 'expense', 'icon': '🛒', 'color': '#8B5E3C'},
    {'name': 'Restaurant', 'type': 'expense', 'icon': '🍔', 'color': '#C1440E'},
    {'name': 'Transport', 'type': 'expense', 'icon': '🚗', 'color': '#7CAFC4'},
    {'name': 'Utilities', 'type': 'expense', 'icon': '💡', 'color': '#6B7F5E'},
    {'name': 'Rent', 'type': 'expense', 'icon': '🏠', 'color': '#8B5E3C'},
    {'name': 'Entertainment', 'type': 'expense', 'icon': '🎬', 'color': '#9B59B6'},
    {'name': 'Health', 'type': 'expense', 'icon': '🏥', 'color': '#E74C3C'},
    {'name': 'Shopping', 'type': 'expense', 'icon': '🛍️', 'color': '#C1440E'},
    {'name': 'Education', 'type': 'expense', 'icon': '📚', 'color': '#3498DB'},
    {'name': 'Gym', 'type': 'expense', 'icon': '🏋️', 'color': '#E67E22'},
    {'name': 'Other', 'type': 'expense', 'icon': '📦', 'color': '#95A5A6'},
]

def seed_categories():
    with app.app_context():
        print("🌱 Seeding default categories...")

        # Check if categories already exist
        existing_count = Category.query.count()
        if existing_count > 0:
            print(f"⚠️  Database already has {existing_count} categories. Skipping seed.")
            return

        # Create categories
        for cat_data in DEFAULT_CATEGORIES:
            category = Category(**cat_data)
            db.session.add(category)

        db.session.commit()
        print(f"✅ Successfully created {len(DEFAULT_CATEGORIES)} categories!")

        # Display created categories
        income_cats = Category.query.filter_by(type='income').all()
        expense_cats = Category.query.filter_by(type='expense').all()

        print(f"\n📊 Income Categories ({len(income_cats)}):")
        for cat in income_cats:
            print(f"   {cat.icon} {cat.name}")

        print(f"\n💸 Expense Categories ({len(expense_cats)}):")
        for cat in expense_cats:
            print(f"   {cat.icon} {cat.name}")

if __name__ == '__main__':
    seed_categories()
