# Desert Ledger

App web para trackear finanzas y hábitos personales.

**Stack:** Python 3 · Flask · SQLAlchemy · PostgreSQL · React 19 · Docker

---

## Arquitectura

```
React (5173) → Vite Proxy → Flask API (5000) → PostgreSQL (5432)
```

Tres contenedores en Docker Compose: `db`, `backend`, `frontend`.

---

## Ejecutar con Docker

```bash
docker-compose up
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

## Estructura

```
perroApp/
├── backend/
│   ├── app/
│   │   ├── __init__.py       # Flask app factory
│   │   ├── config.py         # Configuración / DATABASE_URL
│   │   ├── extensions.py     # SQLAlchemy y Marshmallow
│   │   ├── models/           # Modelos de base de datos
│   │   ├── routes/           # Endpoints REST
│   │   └── schemas/          # Serialización con Marshmallow
│   ├── requirements.txt
│   ├── run.py
│   ├── init_db.py            # Crea las tablas al arrancar
│   ├── seed_data.py          # Inserta categorías por defecto
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Estado global y carga de datos
│   │   ├── pages/            # Dashboard, Transactions, Budgets, Habits
│   │   ├── components/       # Componentes reutilizables
│   │   └── api/client.js     # Cliente HTTP (fetch)
│   └── Dockerfile
└── docker-compose.yml
```

---

## Arranque del backend (entrypoint.sh)

Al iniciar el contenedor se ejecutan tres pasos en orden:

1. `init_db.py` — espera a que PostgreSQL esté listo y crea las tablas con `db.create_all()`
2. `seed_data.py` — inserta categorías por defecto si la tabla está vacía
3. `run.py` — levanta el servidor Flask

---

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/transactions` | Listar transacciones |
| POST | `/api/transactions` | Crear transacción |
| PUT | `/api/transactions/<id>` | Editar transacción |
| DELETE | `/api/transactions/<id>` | Eliminar transacción |
| GET | `/api/categories` | Listar categorías |
| POST | `/api/categories` | Crear categoría |
| GET | `/api/budgets?month=&year=` | Presupuestos del mes |
| POST | `/api/budgets` | Crear presupuesto |
| GET | `/api/habits` | Listar hábitos activos |
| POST | `/api/habits` | Crear hábito |
| POST | `/api/habits/<id>/logs` | Marcar/desmarcar día |
| GET | `/api/dashboard/summary` | Balance e ingresos del mes |
| GET | `/api/dashboard/trends` | Gastos últimos 6 meses |
| GET | `/api/dashboard/habits` | Rachas y % completado |

---

## Modelos

- **Category** — nombre, tipo (income/expense), ícono, color
- **Transaction** — monto, tipo, descripción, fecha, categoría
- **Budget** — categoría, mes, año, límite (unique por categoría+mes+año)
- **Habit** — nombre, frecuencia, días objetivo, color, soft-delete
- **HabitLog** — hábito, fecha, completado (unique por hábito+fecha)
