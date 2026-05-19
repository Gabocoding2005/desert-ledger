import os
import json
from pathlib import Path

_CONFIG = Path(__file__).resolve().parent.parent / 'config.json'


def get_api_key():
    """Returns the Anthropic API key: config file takes priority over env var."""
    if _CONFIG.exists():
        try:
            data = json.loads(_CONFIG.read_text(encoding='utf-8'))
            key = data.get('anthropic_api_key', '').strip()
            if key:
                return key
        except Exception:
            pass
    return os.environ.get('ANTHROPIC_API_KEY', '')


def save_api_key(key: str):
    data = {}
    if _CONFIG.exists():
        try:
            data = json.loads(_CONFIG.read_text(encoding='utf-8'))
        except Exception:
            pass
    data['anthropic_api_key'] = key
    _CONFIG.write_text(json.dumps(data, indent=2), encoding='utf-8')


def delete_api_key():
    if not _CONFIG.exists():
        return
    try:
        data = json.loads(_CONFIG.read_text(encoding='utf-8'))
        data.pop('anthropic_api_key', None)
        _CONFIG.write_text(json.dumps(data, indent=2), encoding='utf-8')
    except Exception:
        pass
