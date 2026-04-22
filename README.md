# 🐫 DESERT LEDGER

### *A Finance & Habit Tracker — Built for the Long Road*

> **Stack:** Python 3 · Flask · SQLAlchemy · SQLite · React 19
> **Aesthetic:** Vintage Camel USA campaigns (1940s–1970s) — bold typography, desert-warm palettes, retro-americana illustrations

---

## 📖 Overview

Desert Ledger is a personal web app for tracking **finances** (income, expenses, budgets, savings goals) and **habits** (streaks, frequencies, progress) in a single, cohesive interface. The design draws inspiration from classic American Camel advertising: earth tones, bold serif typography, weathered borders, and that signature "Walk a Mile" confidence.

---

## 🚀 Quick Start

### 🐳 With Docker (Recommended)

**Prerequisites:** Docker and Docker Compose

```bash
# Start all services (database, backend, frontend)
docker-compose up

# Access the app
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
```

For detailed Docker instructions, see [README-DOCKER.md](README-DOCKER.md)

### 💻 Manual Setup

**Prerequisites:** Python 3.12+, Node.js 18+, Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
flask db init
flask db migrate -m "initial migration"
flask db upgrade

# Create some default categories (optional)
python seed_data.py  # If you create this file

# Run the Flask server
python run.py
```

The backend API will be available at **http://localhost:5000**

### Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at **http://localhost:5173**

---

## 📂 Project Structure

```
desert-ledger/
├── backend/                     # Flask API
│   ├── app/
│   │   ├── __init__.py          # Flask app factory
│   │   ├── config.py            # Configuration (SQLite/PostgreSQL)
│   │   ├── extensions.py        # SQLAlchemy, Migrate, Marshmallow
│   │   ├── models/              # Database models
│   │   ├── routes/              # API endpoints
│   │   └── schemas/             # Marshmallow schemas
│   ├── migrations/              # Database migrations (auto-generated)
│   ├── instance/                # Instance files (SQLite DB)
│   ├── requirements.txt         # Python dependencies
│   ├── run.py                   # Entry point
│   ├── init_db.py              # Docker DB initialization
│   ├── entrypoint.sh           # Docker entrypoint script
│   ├── Dockerfile              # Backend container image
│   └── .dockerignore
│
├── frontend/                    # React + Vite
│   ├── public/
│   │   └── assets/             # Logos and SVG assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # RetroButton, PaperCard, etc.
│   │   │   ├── layout/         # Sidebar, TopBar
│   │   │   ├── finance/        # Finance-specific components
│   │   │   └── habits/         # Habit tracking components
│   │   ├── pages/              # Dashboard, Transactions, Budgets, Habits, Settings
│   │   ├── stores/             # Zustand state management
│   │   ├── api/                # Axios client
│   │   ├── utils/              # currency.js, dates.js
│   │   └── styles/             # Global CSS + design tokens
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js      # Tailwind + custom colors
│   ├── vite.config.js
│   ├── Dockerfile              # Frontend container image
│   └── .dockerignore
│
├── docker-compose.yml          # 3 services: db, backend, frontend
├── .gitignore
├── README.md                   # This file
├── README-DOCKER.md            # Docker setup guide
├── DESIGN-INTEGRATION.md       # Design system documentation
└── APP_SPEC.md                 # Original spec (Spanish)
```

---

## 🎨 Design System

### Color Palette

```css
--camel-sand:      #D4A957   /* Golden sand - primary */
--camel-tobacco:   #8B5E3C   /* Deep tobacco brown */
--camel-cream:     #F5ECD7   /* Aged paper cream */
--camel-rust:      #C1440E   /* Rust red accent */
--camel-midnight:  #1A1A2E   /* Midnight blue */
--camel-sage:      #6B7F5E   /* Desert sage green */
--camel-sky:       #7CAFC4   /* Washed sky blue */
--camel-dust:      #E8D5B7   /* Light dust */
--camel-charcoal:  #2D2D2D   /* Primary text */
--camel-paper:     #FDF8EF   /* Base background */
```

### Typography

- **Display/Headlines:** Playfair Display (bold, condensed, poster style)
- **Body/UI:** Source Serif 4 (editorial serif with character)
- **Monospace/Numbers:** DM Mono (for currency amounts)

---

## 🔌 API Endpoints

### Transactions

- `GET /api/transactions` - List transactions (with filters)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/<id>` - Update transaction
- `DELETE /api/transactions/<id>` - Delete transaction

### Categories

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/<id>` - Update category
- `DELETE /api/categories/<id>` - Delete category

### Budgets

- `GET /api/budgets?month=&year=` - Get budgets for month
- `POST /api/budgets` - Create/update budget
- `DELETE /api/budgets/<id>` - Delete budget

### Habits

- `GET /api/habits` - List active habits
- `POST /api/habits` - Create habit
- `PUT /api/habits/<id>` - Update habit
- `DELETE /api/habits/<id>` - Soft delete habit

### Habit Logs

- `GET /api/habits/<id>/logs?month=&year=` - Get logs for habit
- `POST /api/habits/<id>/logs` - Toggle habit completion

### Dashboard

- `GET /api/dashboard/summary` - Financial summary
- `GET /api/dashboard/trends` - Spending trends
- `GET /api/dashboard/habits` - Habits summary

---

## 🎯 Features

### Finance Tracking
- ✅ Income and expense transactions
- ✅ Category management with custom icons and colors
- ✅ Monthly budget tracking with progress bars
- ✅ Dashboard with balance overview
- ✅ Spending charts by category
- ✅ Transaction filtering and search

### Habit Tracking
- ✅ Daily and weekly habit goals
- ✅ Streak tracking with visual badges
- ✅ Calendar heatmap for completion history
- ✅ Completion percentage metrics
- ✅ Custom colors per habit

### Design
- ✅ Vintage Camel-inspired aesthetic
- ✅ Paper texture overlays
- ✅ Retro button styles with shadow effects
- ✅ Stamp border cards
- ✅ Desert-themed dividers
- ✅ Responsive layout

---

## 🛠️ Development

### Database Migrations

```bash
# Create a new migration after model changes
flask db migrate -m "description of changes"

# Apply migrations
flask db upgrade

# Rollback last migration
flask db downgrade
```

### Building for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
# Use gunicorn or similar WSGI server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

---

## 📝 Notes

- **Authentication:** Not included by default. This is designed as a single-user local app. Add Flask-Login for multi-user support.
- **Database:**
  - Manual setup uses SQLite for simplicity
  - Docker setup uses PostgreSQL for better multi-container support
  - Config automatically detects `DATABASE_URL` environment variable
- **Mobile:** Responsive design with mobile-first approach. Sidebar collapses to bottom nav on mobile.
- **Dark Mode:** Not prioritized. The Camel aesthetic is inherently light/warm themed.
- **Design System:** See [DESIGN-INTEGRATION.md](DESIGN-INTEGRATION.md) for complete design documentation

---

## 🎭 Design Philosophy

1. **"Walk a Mile"** — Every interaction should feel substantial and intentional
2. **Paper, not screen** — Everything looks printed on warm bond paper
3. **Typography as hero** — Big bold numbers are the star
4. **Earned badges** — Habit streaks celebrated with vintage-style badges
5. **Warm > Cool** — Always prioritize warm tones

---

## 📄 License

MIT License - Feel free to use and modify for your personal finance journey.

---

**Built for the long road** 🐫

*Version 1.0.0*
