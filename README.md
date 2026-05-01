# Desert Ledger 🐫

App web personal para trackear finanzas, hábitos y recetas.

**Stack:** Python 3 · Flask · SQLAlchemy · PostgreSQL · React 19 · Tailwind CSS v4 · Docker

---

## Módulos

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | Balance del mes, gastos por categoría, resumen de hábitos |
| **Transactions** | Registro de ingresos y gastos con categorías |
| **Budgets** | Presupuestos mensuales por categoría |
| **Habits** | Tracking diario de hábitos con rachas y % de cumplimiento |
| **Reports** | Reporte mensual con gráficas de tendencia y hábitos. Navegación por meses |
| **Recipes** | Recetario personal. Creación manual o extracción automática desde texto con Claude AI |
| **Settings** | Gestión de categorías y configuración del vault de Obsidian |

---

## Arquitectura

```
React (5173) → Vite Proxy → Flask API (5000) → PostgreSQL (5432)
```

Tres contenedores en Docker Compose: `db`, `backend`, `frontend`.

---

## Ejecutar con Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

```bash
# Detener
docker-compose down

# Resetear base de datos
docker-compose down -v

# Reconstruir imágenes
docker-compose up --build
```

---

## Ejecutar sin Docker

**Requisitos:** Python 3.12+, Node.js 18+, PostgreSQL 15+

**Backend:**

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
set DATABASE_URL=postgresql://user:password@localhost:5432/desert_ledger
python init_db.py
python run.py
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

---

## Variables de entorno

Configurar en `backend/.flaskenv`:

```env
FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=1
ANTHROPIC_API_KEY=tu_api_key_aqui   # Requerida para extracción de recetas con Claude
```

La API key de Anthropic es opcional. Sin ella, el módulo de Recetas funciona en modo manual solamente. Obtener en: https://console.anthropic.com

---

## Integración con Obsidian

Desert Ledger puede exportar reportes y recetas directamente a un vault de Obsidian como archivos Markdown. Los archivos se organizan así:

```
Mi Vault/
└── Desert Ledger/
    ├── Reportes/
    │   └── 2026-04 April.md
    └── Recetas/
        └── Pasta al Pesto.md
```

Para activarlo, ir a **Settings → Obsidian Vault**, ingresar la ruta local del vault y presionar "Probar y Guardar". El botón "🟣 Exportar" aparece en la página de Reports y en cada receta.

---

## Estructura

```
perroApp/
├── backend/
│   ├── app/
│   │   ├── __init__.py         # Flask app factory
│   │   ├── config.py           # Configuración / DATABASE_URL
│   │   ├── extensions.py       # SQLAlchemy y Marshmallow
│   │   ├── models/
│   │   │   ├── category.py
│   │   │   ├── transaction.py
│   │   │   ├── budget.py
│   │   │   ├── habit.py
│   │   │   ├── habit_log.py
│   │   │   └── recipe.py
│   │   ├── routes/
│   │   │   ├── categories.py
│   │   │   ├── transactions.py
│   │   │   ├── budgets.py
│   │   │   ├── habits.py       # Incluye /pending-today
│   │   │   ├── habit_logs.py
│   │   │   ├── dashboard.py
│   │   │   ├── recipes.py      # CRUD + /extract con Claude API
│   │   │   └── obsidian.py     # Export a vault local
│   │   └── schemas/
│   ├── requirements.txt
│   ├── run.py
│   ├── init_db.py              # Crea las tablas al arrancar
│   └── seed_data.py            # Inserta categorías por defecto
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # Estado global, loaders, navegación
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Budgets.jsx
│   │   │   ├── Habits.jsx
│   │   │   ├── Reports.jsx     # Gráficas mensuales con navegación
│   │   │   ├── Recipes.jsx     # CRUD + filtro por tag
│   │   │   └── Settings.jsx    # Categorías + config Obsidian
│   │   ├── components/
│   │   │   ├── finance/
│   │   │   ├── habits/
│   │   │   ├── recipes/        # RecipeCard, RecipeModal
│   │   │   ├── layout/         # Sidebar (con badge pendientes), TopBar (campana)
│   │   │   └── ui/
│   │   └── api/client.js
│   └── Dockerfile
└── docker-compose.yml
```

---

## Arranque del backend

Al iniciar el contenedor se ejecutan tres pasos en orden:

1. `init_db.py` — espera a que PostgreSQL esté listo y crea las tablas con `db.create_all()`
2. `seed_data.py` — inserta categorías por defecto si la tabla está vacía
3. `run.py` — levanta el servidor Flask

---

## API Endpoints

### Transactions
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/transactions` | Listar (filtros: `month`, `year`) |
| POST | `/api/transactions` | Crear |
| PUT | `/api/transactions/<id>` | Editar |
| DELETE | `/api/transactions/<id>` | Eliminar |

### Categories
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/categories` | Listar |
| POST | `/api/categories` | Crear |

### Budgets
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/budgets` | Listar (filtros: `month`, `year`) |
| POST | `/api/budgets` | Crear / actualizar |

### Habits
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/habits` | Listar activos |
| POST | `/api/habits` | Crear |
| PUT | `/api/habits/<id>` | Editar |
| DELETE | `/api/habits/<id>` | Soft delete |
| GET | `/api/habits/pending-today` | Hábitos no completados hoy |
| GET | `/api/habits/<id>/logs` | Logs del hábito |
| POST | `/api/habits/<id>/logs` | Toggle día completado |

### Dashboard
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/dashboard/summary` | Balance, ingresos, gastos y top categorías del mes |
| GET | `/api/dashboard/trends` | Gastos de los últimos 6 meses |
| GET | `/api/dashboard/habits` | Rachas y % de cumplimiento |

### Recipes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/recipes` | Listar (filtro: `tag`) |
| GET | `/api/recipes/<id>` | Detalle |
| POST | `/api/recipes` | Crear |
| PUT | `/api/recipes/<id>` | Editar |
| DELETE | `/api/recipes/<id>` | Eliminar |
| POST | `/api/recipes/extract` | Extraer receta estructurada de texto libre (Claude API) |

### Obsidian
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/obsidian/test` | Validar ruta del vault |
| POST | `/api/obsidian/export-report` | Exportar reporte mensual como `.md` |
| POST | `/api/obsidian/export-recipe/<id>` | Exportar receta como `.md` |

---

## Modelos

| Modelo | Campos clave |
|--------|-------------|
| **Category** | nombre, tipo (income/expense), ícono, color |
| **Transaction** | monto, tipo, descripción, fecha, categoría |
| **Budget** | categoría, mes, año, límite (unique por categoría+mes+año) |
| **Habit** | nombre, frecuencia, días objetivo, color, soft-delete |
| **HabitLog** | hábito, fecha, completado (unique por hábito+fecha) |
| **Recipe** | título, descripción, ingredientes (JSON), pasos (JSON), tags (JSON), tiempos, porciones |
