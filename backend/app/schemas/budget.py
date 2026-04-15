from app.extensions import ma
from app.models.budget import Budget
from marshmallow import fields


class BudgetSchema(ma.SQLAlchemyAutoSchema):
    category = fields.Nested('CategorySchema', only=['id', 'name', 'icon', 'color'])

    class Meta:
        model = Budget
        load_instance = True
        include_fk = True


budget_schema = BudgetSchema()
budgets_schema = BudgetSchema(many=True)
