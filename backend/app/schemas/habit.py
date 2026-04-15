from app.extensions import ma
from app.models.habit import Habit


class HabitSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Habit
        load_instance = True
        include_fk = True


habit_schema = HabitSchema()
habits_schema = HabitSchema(many=True)
