from app.extensions import ma
from app.models.recipe import Recipe


class RecipeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Recipe
        load_instance = True


recipe_schema = RecipeSchema()
recipes_schema = RecipeSchema(many=True)
