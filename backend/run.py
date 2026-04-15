from app import create_app, db
from app.models import Category, Transaction, Budget, Habit, HabitLog

app = create_app()


@app.shell_context_processor
def make_shell_context():
    """Add models to shell context for easier debugging"""
    return {
        'db': db,
        'Category': Category,
        'Transaction': Transaction,
        'Budget': Budget,
        'Habit': Habit,
        'HabitLog': HabitLog
    }


if __name__ == '__main__':
    app.run(debug=True, port=5000)
