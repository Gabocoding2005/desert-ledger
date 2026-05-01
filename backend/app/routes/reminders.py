from flask import Blueprint, current_app, request, jsonify
from app.scheduler import load_settings, save_settings, send_email, _get_pending

bp = Blueprint('reminders', __name__, url_prefix='/api/reminders')


@bp.route('/settings', methods=['GET'])
def get_settings():
    return jsonify(load_settings())


@bp.route('/settings', methods=['POST'])
def update_settings():
    data = request.get_json() or {}
    return jsonify(save_settings(data))


@bp.route('/test', methods=['POST'])
def test_send():
    settings = load_settings()
    if not settings['email']:
        return jsonify({'error': 'No hay email configurado'}), 400

    app = current_app._get_current_object()
    pending = _get_pending(app)

    if not pending:
        return jsonify({'ok': True, 'sent': 0, 'message': 'No hay hábitos pendientes ahora mismo'})

    try:
        send_email(pending, settings['email'])
        return jsonify({'ok': True, 'sent': len(pending)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
