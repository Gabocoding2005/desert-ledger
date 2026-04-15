from datetime import datetime, timezone
from app.extensions import db


class Budget(db.Model):
    """Presupuestos mensuales por categoría"""
    __tablename__ = 'budgets'

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    month = db.Column(db.Integer, nullable=False)  # 1-12
    year = db.Column(db.Integer, nullable=False)
    limit_amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Unique constraint
    __table_args__ = (
        db.UniqueConstraint('category_id', 'month', 'year', name='unique_budget_per_month'),
    )

    def __repr__(self):
        return f'<Budget {self.category.name if self.category else "?"} {self.month}/{self.year} ${self.limit_amount}>'
