import base64
import json
from datetime import date
from flask import Blueprint, request, jsonify
from app.claude_key import get_api_key

bp = Blueprint('receipts', __name__, url_prefix='/api/receipts')

ALLOWED_TYPES = {'image/jpeg', 'image/png', 'image/webp'}


@bp.route('/scan', methods=['POST'])
def scan_receipt():
    """Extrae datos de transacción de una imagen de recibo usando Claude vision."""
    if 'image' not in request.files:
        return jsonify({'error': 'Se requiere el campo "image"'}), 400

    file = request.files['image']
    if not file.filename:
        return jsonify({'error': 'No se seleccionó ningún archivo'}), 400

    if file.content_type not in ALLOWED_TYPES:
        return jsonify({'error': 'Formato no soportado. Usa JPG, PNG o WebP'}), 400

    api_key = get_api_key()
    if not api_key:
        return jsonify({'error': 'API key de Claude no configurada. Ve a Configuración para agregarla.'}), 500

    try:
        image_data = base64.standard_b64encode(file.read()).decode('utf-8')

        import anthropic
        client = anthropic.Anthropic(api_key=api_key)

        today = date.today().isoformat()

        message = client.messages.create(
            model='claude-haiku-4-5-20251001',
            max_tokens=512,
            messages=[{
                'role': 'user',
                'content': [
                    {
                        'type': 'image',
                        'source': {
                            'type': 'base64',
                            'media_type': file.content_type,
                            'data': image_data,
                        },
                    },
                    {
                        'type': 'text',
                        'text': f"""Analiza este recibo o ticket de compra y extrae los datos para registrar un gasto.
Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:
{{
  "amount": 150.00,
  "description": "nombre del establecimiento o tipo de compra",
  "date": "YYYY-MM-DD",
  "category_suggestion": "categoría sugerida"
}}

Reglas:
- amount: total a pagar como número sin símbolo de moneda
- description: nombre del negocio o descripción breve, máximo 60 caracteres
- date: fecha del ticket en formato ISO; si no se ve claramente usa hoy: {today}
- category_suggestion: una de estas opciones según el tipo de compra: Comida, Supermercado, Transporte, Ropa, Entretenimiento, Salud, Servicios, Educación, Hogar, Otro

Si la imagen no es un recibo o no puedes leer los datos, devuelve: {{"error": "No se pudo leer el recibo"}}""",
                    },
                ],
            }],
        )

        raw = message.content[0].text.strip()
        if raw.startswith('```'):
            raw = raw.split('```')[1]
            if raw.startswith('json'):
                raw = raw[4:]
        extracted = json.loads(raw)

        if 'error' in extracted:
            return jsonify({'error': extracted['error']}), 422

        return jsonify(extracted)

    except json.JSONDecodeError:
        return jsonify({'error': 'No se pudo interpretar la respuesta de Claude'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
