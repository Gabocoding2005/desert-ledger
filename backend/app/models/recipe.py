from datetime import datetime, timezone
from app.extensions import db


class Recipe(db.Model):
    __tablename__ = 'recipes'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500))
    ingredients = db.Column(db.JSON, nullable=False, default=list)
    steps = db.Column(db.JSON, nullable=False, default=list)
    tags = db.Column(db.JSON, default=list)
    prep_time = db.Column(db.Integer)   # minutos
    cook_time = db.Column(db.Integer)   # minutos
    servings = db.Column(db.Integer)
    source_text = db.Column(db.Text)    # texto original pegado por el usuario
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<Recipe {self.title}>'
