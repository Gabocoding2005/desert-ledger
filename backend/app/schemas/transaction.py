from app.extensions import ma
from app.models.transaction import Transaction
from marshmallow import fields


class TransactionSchema(ma.SQLAlchemyAutoSchema):
    category = fields.Nested('CategorySchema', only=['id', 'name', 'icon', 'color'])

    class Meta:
        model = Transaction
        load_instance = True
        include_fk = True


transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)
