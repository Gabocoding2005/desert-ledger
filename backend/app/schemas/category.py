from app.extensions import ma
from app.models.category import Category


class CategorySchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True
        include_fk = True


category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
