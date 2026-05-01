from flask import Flask
from flask_cors import CORS
from app.extensions import db, ma
from app.config import Config


def create_app(config_class=Config):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)
    CORS(app)

    # Register blueprints
    from app.routes import transactions, categories, budgets, habits, habit_logs, dashboard, recipes, obsidian, reminders

    app.register_blueprint(transactions.bp)
    app.register_blueprint(categories.bp)
    app.register_blueprint(budgets.bp)
    app.register_blueprint(habits.bp)
    app.register_blueprint(habit_logs.bp)
    app.register_blueprint(dashboard.bp)
    app.register_blueprint(recipes.bp)
    app.register_blueprint(obsidian.bp)
    app.register_blueprint(reminders.bp)

    from app.scheduler import init_scheduler
    init_scheduler(app)

    # Health check
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'Desert Ledger API is running'}

    return app
