import json
import os
import smtplib
from datetime import date, datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()

SETTINGS_FILE = Path(__file__).resolve().parent.parent / 'reminder_settings.json'
_DEFAULTS = {'enabled': False, 'email': '', 'time': '08:00'}


def load_settings():
    if SETTINGS_FILE.exists():
        try:
            return {**_DEFAULTS, **json.loads(SETTINGS_FILE.read_text(encoding='utf-8'))}
        except Exception:
            pass
    return _DEFAULTS.copy()


def save_settings(data):
    merged = {**load_settings(), **{k: v for k, v in data.items() if k in _DEFAULTS}}
    SETTINGS_FILE.write_text(json.dumps(merged, indent=2, ensure_ascii=False), encoding='utf-8')
    return merged


def _get_pending(app):
    with app.app_context():
        from app.models import Habit, HabitLog
        today = date.today()
        habits = Habit.query.filter_by(is_active=True).all()
        return [
            h for h in habits
            if not HabitLog.query.filter_by(habit_id=h.id, date=today, completed=True).first()
        ]


def send_email(pending, recipient):
    gmail_user = os.environ.get('GMAIL_USER', '').strip()
    gmail_pass = os.environ.get('GMAIL_APP_PASSWORD', '').strip()

    if not gmail_user or not gmail_pass:
        raise ValueError('Configura GMAIL_USER y GMAIL_APP_PASSWORD en .flaskenv')

    count = len(pending)
    plural = 's' if count > 1 else ''
    items  = ''.join(f'<li style="line-height:2">{h.name}</li>' for h in pending)

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'🐫 Desert Ledger — {count} hábito{plural} pendiente{plural} hoy'
    msg['From']    = gmail_user
    msg['To']      = recipient

    html = f"""
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:24px;
            background:#FDF8EF;border:3px solid #8B5E3C;">
  <h1 style="font-size:28px;color:#8B5E3C;margin-bottom:4px;">🐫 Desert Ledger</h1>
  <p style="color:#8B5E3C;font-style:italic;font-size:14px;margin-top:0;">
    Walk a mile in your finances.
  </p>
  <hr style="border:2px solid #D4A957;margin:16px 0;">
  <h2 style="color:#2D2D2D;font-size:20px;">
    Tienes {count} hábito{plural} pendiente{plural} para hoy
  </h2>
  <ul style="padding-left:20px;color:#2D2D2D;font-size:16px;">{items}</ul>
  <p style="color:#8B5E3C;font-size:14px;margin-top:24px;">¡Aún estás a tiempo de completarlos! 💪</p>
  <hr style="border:1px solid #E8D5B7;margin:16px 0;">
  <p style="color:#aaa;font-size:11px;">Enviado por Desert Ledger — {datetime.now().strftime('%Y-%m-%d %H:%M')}</p>
</div>"""

    msg.attach(MIMEText(html, 'html', 'utf-8'))

    with smtplib.SMTP('smtp.gmail.com', 587) as srv:
        srv.starttls()
        srv.login(gmail_user, gmail_pass)
        srv.sendmail(gmail_user, recipient, msg.as_string())


def _check_and_send(app):
    settings = load_settings()
    if not settings['enabled'] or not settings['email']:
        return
    if datetime.now().strftime('%H:%M') != settings['time']:
        return
    pending = _get_pending(app)
    if pending:
        try:
            send_email(pending, settings['email'])
            print(f'[reminder] Email enviado a {settings["email"]} — {len(pending)} hábito(s) pendiente(s)')
        except Exception as e:
            print(f'[reminder] Error: {e}')


def init_scheduler(app):
    if not scheduler.running:
        scheduler.add_job(
            func=lambda: _check_and_send(app),
            trigger='interval',
            minutes=1,
            id='reminder_check',
            replace_existing=True,
        )
        scheduler.start()
