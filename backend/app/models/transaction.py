from datetime import datetime, timezone, date as date_type
from app.extensions import db


class Transaction(db.Model):
    """Transacciones financieras (ingresos y gastos)"""
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'income' or 'expense'
    description = db.Column(db.String(200))
    date = db.Column(db.Date, nullable=False, default=date_type.today)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<Transaction {self.type} ${self.amount} on {self.date}>'
