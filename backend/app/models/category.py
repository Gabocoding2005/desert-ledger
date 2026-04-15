from datetime import datetime, timezone
from app.extensions import db


class Category(db.Model):
    """Categorías financieras (ingresos o gastos)"""
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'income' or 'expense'
    icon = db.Column(db.String(50), default='💰')
    color = db.Column(db.String(7), default='#D4A957')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    transactions = db.relationship('Transaction', backref='category', lazy=True, cascade='all, delete-orphan')
    budgets = db.relationship('Budget', backref='category', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Category {self.name} ({self.type})>'
