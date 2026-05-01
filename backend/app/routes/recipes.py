import os
import json
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.recipe import Recipe
from app.schemas.recipe import recipe_schema, recipes_schema

bp = Blueprint('recipes', __name__, url_prefix='/api/recipes')


@bp.route('', methods=['GET'])
def get_recipes():
    tag = request.args.get('tag')
    query = Recipe.query.order_by(Recipe.created_at.desc())
    if tag:
        query = query.filter(Recipe.tags.contains([tag]))
    return jsonify(recipes_schema.dump(query.all()))


@bp.route('/<int:id>', methods=['GET'])
def get_recipe(id):
    recipe = Recipe.query.get_or_404(id)
    return jsonify(recipe_schema.dump(recipe))


@bp.route('', methods=['POST'])
def create_recipe():
    data = request.get_json()
    recipe = Recipe(
        title=data['title'],
        description=data.get('description', ''),
        ingredients=data.get('ingredients', []),
        steps=data.get('steps', []),
        tags=data.get('tags', []),
        prep_time=data.get('prep_time'),
        cook_time=data.get('cook_time'),
        servings=data.get('servings'),
        source_text=data.get('source_text', ''),
    )
    db.session.add(recipe)
    db.session.commit()
    return jsonify(recipe_schema.dump(recipe)), 201


@bp.route('/<int:id>', methods=['PUT'])
def update_recipe(id):
    recipe = Recipe.query.get_or_404(id)
    data = request.get_json()

    for field in ('title', 'description', 'ingredients', 'steps', 'tags',
                  'prep_time', 'cook_time', 'servings', 'source_text'):
        if field in data:
            setattr(recipe, field, data[field])

    db.session.commit()
    return jsonify(recipe_schema.dump(recipe))


@bp.route('/<int:id>', methods=['DELETE'])
def delete_recipe(id):
    recipe = Recipe.query.get_or_404(id)
    db.session.delete(recipe)
    db.session.commit()
    return '', 204


@bp.route('/extract', methods=['POST'])
def extract_recipe():
    """Extrae una receta estructurada de texto libre usando Claude API."""
    data = request.get_json()
    text = data.get('text', '').strip()

    if not text:
        return jsonify({'error': 'Se requiere el campo "text"'}), 400

    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        return jsonify({'error': 'ANTHROPIC_API_KEY no configurada'}), 500

    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)

        message = client.messages.create(
            model='claude-haiku-4-5-20251001',
            max_tokens=1024,
            messages=[{
                'role': 'user',
                'content': f"""Extrae la receta del siguiente texto y devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:
{{
  "title": "nombre de la receta",
  "description": "descripción breve (1-2 oraciones)",
  "ingredients": ["ingrediente 1 con cantidad", "ingrediente 2 con cantidad"],
  "steps": ["paso 1", "paso 2"],
  "tags": ["tag1", "tag2"],
  "prep_time": 15,
  "cook_time": 30,
  "servings": 4
}}

prep_time y cook_time son en minutos (número entero o null si no se menciona).
servings es número entero o null si no se menciona.
tags son palabras clave de la receta (tipo de cocina, ingrediente principal, etc).

Texto:
{text}"""
            }]
        )

        raw = message.content[0].text.strip()
        # Limpiar posibles bloques de código markdown
        if raw.startswith('```'):
            raw = raw.split('```')[1]
            if raw.startswith('json'):
                raw = raw[4:]
        extracted = json.loads(raw)
        return jsonify(extracted)

    except json.JSONDecodeError:
        return jsonify({'error': 'Claude no devolvió JSON válido'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
