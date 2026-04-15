from datetime import datetime, timezone
from app.extensions import db


class Habit(db.Model):
    """Definición de hábitos a trackear"""
    __tablename__ = 'habits'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(300))
    frequency = db.Column(db.String(20), default='daily')  # 'daily' or 'weekly'
    target_days = db.Column(db.Integer, default=7)  # Días por semana (1-7)
    color = db.Column(db.String(7), default='#D4A957')
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    logs = db.relationship('HabitLog', backref='habit', lazy=True, cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Habit {self.name} ({self.frequency})>'
