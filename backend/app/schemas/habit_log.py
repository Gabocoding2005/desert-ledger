from app.extensions import ma
from app.models.habit_log import HabitLog
from marshmallow import fields


class HabitLogSchema(ma.SQLAlchemyAutoSchema):
    habit = fields.Nested('HabitSchema', only=['id', 'name', 'color'])

    class Meta:
        model = HabitLog
        load_instance = True
        include_fk = True


habit_log_schema = HabitLogSchema()
habit_logs_schema = HabitLogSchema(many=True)
