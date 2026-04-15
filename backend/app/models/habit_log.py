from datetime import date as date_type
from app.extensions import db


class HabitLog(db.Model):
    """Registro diario de completitud de hábitos"""
    __tablename__ = 'habit_logs'

    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey('habits.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=date_type.today)
    completed = db.Column(db.Boolean, default=True)
    notes = db.Column(db.String(200))

    # Unique constraint
    __table_args__ = (
        db.UniqueConstraint('habit_id', 'date', name='unique_habit_log_per_day'),
    )

    def __repr__(self):
        return f'<HabitLog {self.habit.name if self.habit else "?"} on {self.date}>'
