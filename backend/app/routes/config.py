import os
from flask import Blueprint, request, jsonify
from app.claude_key import get_api_key, save_api_key, delete_api_key

bp = Blueprint('config', __name__, url_prefix='/api/config')


def _key_status(key):
    if not key:
        return {'configured': False, 'source': 'none', 'masked_key': None}
    from pathlib import Path
    import json
    config_file = Path(__file__).resolve().parent.parent.parent / 'config.json'
    source = 'env'
    if config_file.exists():
        try:
            data = json.loads(config_file.read_text(encoding='utf-8'))
            if data.get('anthropic_api_key', '').strip():
                source = 'file'
        except Exception:
            pass
    return {
        'configured': True,
        'source': source,
        'masked_key': f"sk-...{key[-6:]}",
    }


@bp.route('/claude', methods=['GET'])
def get_claude_config():
    key = get_api_key()
    return jsonify(_key_status(key))


@bp.route('/claude', methods=['POST'])
def save_claude_config():
    data = request.get_json()
    key = (data.get('api_key') or '').strip()

    if not key:
        return jsonify({'error': 'La API key no puede estar vacía'}), 400
    if not key.startswith('sk-'):
        return jsonify({'error': 'La key debe empezar con "sk-"'}), 400

    save_api_key(key)
    return jsonify({
        'configured': True,
        'source': 'file',
        'masked_key': f"sk-...{key[-6:]}",
    })


@bp.route('/claude', methods=['DELETE'])
def delete_claude_config():
    delete_api_key()
    env_key = os.environ.get('ANTHROPIC_API_KEY', '')
    return jsonify(_key_status(env_key))
