# 🐫 DESERT LEDGER

### *A Finance & Habit Tracker — Built for the Long Road*

> **Stack:** Python 3 · Flask · SQLAlchemy · SQLite · React 19  
> **Estética:** Campañas vintage de Camel USA (1940s–1970s) — tipografía bold, paletas desert-warm, ilustraciones retro-americana, texturas de papel envejecido.

---

## 1. Visión del Producto

Una app web personal para trackear **finanzas** (ingresos, gastos, presupuestos, metas de ahorro) y **hábitos** (rachas, frecuencias, progreso) en una sola interfaz. El diseño toma inspiración directa de la publicidad clásica americana de Camel: colores tierra, tipografía bold con serifs pesados, bordes envejecidos, y esa confianza visual de "Walk a Mile" y "I'd Walk a Mile for a Camel".

---

## 2. Arquitectura General

```
┌─────────────────────────────────┐
│          FRONTEND               │
│  React 19 (Vite)                │
│  TanStack Router · Zustand      │
│  Recharts · Tailwind CSS        │
└──────────┬──────────────────────┘
           │  REST API (JSON)
           ▼
┌─────────────────────────────────┐
│          BACKEND                │
│  Python 3.12 · Flask 3.x        │
│  Flask-SQLAlchemy · Marshmallow │
│  Flask-CORS · Flask-Migrate     │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│        BASE DE DATOS            │
│  SQLite (dev/prod single-user)  │
│  Alembic migrations             │
└─────────────────────────────────┘
```

---

## 3. Estructura de Carpetas

```
desert-ledger/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # create_app factory
│   │   ├── config.py            # Settings / DB path
│   │   ├── extensions.py        # db, migrate, ma instances
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── transaction.py   # Income / Expense
│   │   │   ├── category.py      # Categorías financieras
│   │   │   ├── budget.py        # Presupuestos mensuales
│   │   │   ├── habit.py         # Definición de hábitos
│   │   │   └── habit_log.py     # Logs diarios de hábitos
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── transactions.py  # CRUD transacciones
│   │   │   ├── categories.py    # CRUD categorías
│   │   │   ├── budgets.py       # CRUD presupuestos
│   │   │   ├── habits.py        # CRUD hábitos
│   │   │   ├── habit_logs.py    # Registro diario
│   │   │   └── dashboard.py     # Aggregations / stats
│   │   └── schemas/
│   │       ├── __init__.py
│   │       └── ...              # Marshmallow schemas
│   ├── migrations/              # Alembic
│   ├── instance/
│   │   └── desert_ledger.db     # SQLite file
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── public/
│   │   └── fonts/               # Western / retro fonts
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api/                 # Axios / fetch wrappers
│   │   ├── stores/              # Zustand stores
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Budgets.jsx
│   │   │   ├── Habits.jsx
│   │   │   └── Settings.jsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── TopBar.jsx
│   │   │   │   └── PageShell.jsx
│   │   │   ├── finance/
│   │   │   │   ├── TransactionRow.jsx
│   │   │   │   ├── BudgetCard.jsx
│   │   │   │   ├── SpendingChart.jsx
│   │   │   │   └── BalanceBanner.jsx
│   │   │   ├── habits/
│   │   │   │   ├── HabitCard.jsx
│   │   │   │   ├── StreakBadge.jsx
│   │   │   │   ├── CalendarHeatmap.jsx
│   │   │   │   └── HabitForm.jsx
│   │   │   └── ui/
│   │   │       ├── RetroButton.jsx
│   │   │       ├── PaperCard.jsx
│   │   │       ├── DesertDivider.jsx
│   │   │       └── CamelBadge.jsx
│   │   ├── styles/
│   │   │   ├── index.css        # CSS vars + globals
│   │   │   └── paper-texture.css
│   │   └── utils/
│   │       ├── currency.js
│   │       └── dates.js
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 4. Modelos de Base de Datos (SQLAlchemy)

### 4.1 `Category`

| Column      | Type         | Notes                          |
|-------------|--------------|--------------------------------|
| id          | Integer PK   | Auto                           |
| name        | String(80)   | Unique, not null               |
| type        | String(20)   | `"income"` o `"expense"`       |
| icon        | String(50)   | Emoji o icon class             |
| color       | String(7)    | Hex color                      |
| created_at  | DateTime     | Default UTC now                |

### 4.2 `Transaction`

| Column      | Type         | Notes                          |
|-------------|--------------|--------------------------------|
| id          | Integer PK   | Auto                           |
| amount      | Float        | Positivo siempre               |
| type        | String(20)   | `"income"` / `"expense"`       |
| description | String(200)  | Nullable                       |
| date        | Date         | Fecha de la transacción        |
| category_id | Integer FK   | → Category.id                  |
| created_at  | DateTime     | Default UTC now                |

### 4.3 `Budget`

| Column      | Type         | Notes                          |
|-------------|--------------|--------------------------------|
| id          | Integer PK   | Auto                           |
| category_id | Integer FK   | → Category.id                  |
| month       | Integer      | 1–12                           |
| year        | Integer      | e.g. 2026                      |
| limit_amount| Float        | Presupuesto máximo             |
| created_at  | DateTime     | Default UTC now                |

**Unique constraint:** `(category_id, month, year)`

### 4.4 `Habit`

| Column      | Type         | Notes                          |
|-------------|--------------|--------------------------------|
| id          | Integer PK   | Auto                           |
| name        | String(100)  | Not null                       |
| description | String(300)  | Nullable                       |
| frequency   | String(20)   | `"daily"` / `"weekly"`         |
| target_days | Integer      | Días por semana (1–7)          |
| color       | String(7)    | Hex para UI                    |
| is_active   | Boolean      | Default True                   |
| created_at  | DateTime     | Default UTC now                |

### 4.5 `HabitLog`

| Column      | Type         | Notes                          |
|-------------|--------------|--------------------------------|
| id          | Integer PK   | Auto                           |
| habit_id    | Integer FK   | → Habit.id                     |
| date        | Date         | Día completado                 |
| completed   | Boolean      | Default True                   |
| notes       | String(200)  | Nullable                       |

**Unique constraint:** `(habit_id, date)`

---

## 5. API Endpoints

### Transactions

| Method | Route                        | Descripción                    |
|--------|------------------------------|--------------------------------|
| GET    | `/api/transactions`          | Listar (filtros: mes, categoría, tipo) |
| POST   | `/api/transactions`          | Crear transacción              |
| PUT    | `/api/transactions/<id>`     | Editar                         |
| DELETE | `/api/transactions/<id>`     | Eliminar                       |

### Categories

| Method | Route                        | Descripción                    |
|--------|------------------------------|--------------------------------|
| GET    | `/api/categories`            | Listar todas                   |
| POST   | `/api/categories`            | Crear                          |
| PUT    | `/api/categories/<id>`       | Editar                         |
| DELETE | `/api/categories/<id>`       | Eliminar (solo si sin txns)    |

### Budgets

| Method | Route                        | Descripción                    |
|--------|------------------------------|--------------------------------|
| GET    | `/api/budgets?month=&year=`  | Presupuestos del mes           |
| POST   | `/api/budgets`               | Crear / actualizar             |
| DELETE | `/api/budgets/<id>`          | Eliminar                       |

### Habits

| Method | Route                        | Descripción                    |
|--------|------------------------------|--------------------------------|
| GET    | `/api/habits`                | Listar hábitos activos         |
| POST   | `/api/habits`                | Crear hábito                   |
| PUT    | `/api/habits/<id>`           | Editar                         |
| DELETE | `/api/habits/<id>`           | Soft-delete (is_active=False)  |

### Habit Logs

| Method | Route                        | Descripción                    |
|--------|------------------------------|--------------------------------|
| GET    | `/api/habits/<id>/logs?month=&year=` | Logs del mes          |
| POST   | `/api/habits/<id>/logs`      | Toggle día                     |

### Dashboard

| Method | Route                        | Descripción                    |
|--------|------------------------------|--------------------------------|
| GET    | `/api/dashboard/summary`     | Balance, totales, top cats     |
| GET    | `/api/dashboard/trends`      | Gastos por mes (últimos 6)     |
| GET    | `/api/dashboard/habits`      | Rachas actuales, completion %  |

---

## 6. Dirección Visual: Estilo Camel Campaign

### 6.1 Paleta de Colores

```css
:root {
  /* --- Desert Warm Core --- */
  --camel-sand:        #D4A957;   /* Dorado arena principal      */
  --camel-tobacco:     #8B5E3C;   /* Marrón tabaco profundo      */
  --camel-cream:       #F5ECD7;   /* Crema papel envejecido      */
  --camel-rust:        #C1440E;   /* Rojo óxido / acento fuerte  */
  --camel-midnight:    #1A1A2E;   /* Azul noche para contraste   */

  /* --- Supporting --- */
  --camel-sage:        #6B7F5E;   /* Verde sage desierto         */
  --camel-sky:         #7CAFC4;   /* Azul cielo lavado           */
  --camel-dust:        #E8D5B7;   /* Polvo claro para fondos     */
  --camel-charcoal:    #2D2D2D;   /* Texto principal             */
  --camel-paper:       #FDF8EF;   /* Fondo base "papel viejo"    */

  /* --- Semantic --- */
  --income-color:      #4A7C59;   /* Verde billete               */
  --expense-color:     #C1440E;   /* Rojo gasto                  */
  --streak-color:      #D4A957;   /* Dorado racha                */
}
```

### 6.2 Tipografía

```css
/* Display / Headlines — Bold, condensada, estilo poster */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');

/* Body / UI — Serif editorial con carácter */
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&display=swap');

/* Monospace / Números — Para cantidades */
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');

:root {
  --font-display:  'Playfair Display', Georgia, serif;
  --font-body:     'Source Serif 4', 'Times New Roman', serif;
  --font-mono:     'DM Mono', 'Courier New', monospace;
}
```

### 6.3 Texturas y Efectos

```css
/* Paper texture overlay */
.paper-texture {
  background-image:
    url("data:image/svg+xml,..."); /* noise grain SVG */
  background-color: var(--camel-paper);
  position: relative;
}

.paper-texture::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(139, 94, 60, 0.08) 100%
  );
  pointer-events: none;
}

/* Bordes estilo sello / stamp */
.stamp-border {
  border: 3px solid var(--camel-tobacco);
  box-shadow:
    inset 0 0 0 1px var(--camel-sand),
    4px 4px 0 var(--camel-tobacco);
}

/* Efecto "burned edges" para cards */
.burned-card {
  border-radius: 2px;
  box-shadow:
    0 2px 8px rgba(0,0,0,0.15),
    0 0 0 1px var(--camel-dust);
  background:
    linear-gradient(
      135deg,
      var(--camel-cream) 0%,
      var(--camel-paper) 100%
    );
}
```

### 6.4 Componentes UI Clave

**RetroButton** — Botones con estilo de tipografía publicitaria, bordes sólidos, hover con sombra desplazada.

**PaperCard** — Contenedores con textura de papel, sombra tipo recorte de periódico, esquinas ligeramente irregulares.

**DesertDivider** — Separadores con motivos de cactus, líneas punteadas estilo mapa del desierto, o siluetas de horizonte.

**CamelBadge** — Badges/insignias para rachas y logros con estilo de emblemas vintage (coronas de laurel, estrellas, cintas).

**BalanceBanner** — Banner principal del dashboard con tipografía condensada gigante mostrando el balance, estilo headline de periódico de los 50s.

### 6.5 Principios de Diseño

1. **"Walk a Mile"** — Cada interacción debe sentirse como un paso sólido. Transiciones suaves pero con peso.
2. **Papel, no pantalla** — Todo debe verse como si estuviera impreso en papel bond cálido. Nada de fondos blancos puros.
3. **Tipografía como héroe** — Los números grandes son el protagonista. Cantidades en display bold, etiquetas pequeñas en serif.
4. **Insignias ganadas** — Las rachas de hábitos se celebran con badges tipo scout/militar vintage.
5. **Warm > Cool** — Siempre priorizar tonos cálidos. El azul se usa solo como acento de contraste, nunca como dominante.

---

## 7. Páginas y Flujos

### 7.1 Dashboard (`/`)

```
┌──────────────────────────────────────────────┐
│  🐫 DESERT LEDGER            [Abril 2026 ▾] │
├──────────────────────────────────────────────┤
│                                              │
│   ╔══════════════════════════════════════╗    │
│   ║  THIS MONTH'S BALANCE               ║    │
│   ║  $12,450.00                          ║    │
│   ║  ▲ Income $18,200  ▼ Spent $5,750   ║    │
│   ╚══════════════════════════════════════╝    │
│                                              │
│   ┌─── SPENDING ───┐  ┌─── HABITS ────┐     │
│   │ [Bar chart por  │  │ 🔥 12 días    │     │
│   │  categoría con  │  │    racha       │     │
│   │  colores arena] │  │               │     │
│   │                 │  │ ✅ 4/5 hoy    │     │
│   └─────────────────┘  └───────────────┘     │
│                                              │
│   RECENT TRANSACTIONS                        │
│   ─────────────────────────                  │
│   Abr 14  Uber Eats       -$285    🍔       │
│   Abr 14  Freelance       +$3,200  💼       │
│   Abr 13  Gym             -$899    🏋️       │
│                                              │
└──────────────────────────────────────────────┘
```

### 7.2 Transactions (`/transactions`)

Lista scrollable con filtros por mes, categoría, tipo. Cada fila es un "recorte de periódico". Formulario modal para agregar/editar con campos estilo formulario vintage (labels arriba, inputs con underline, no bordes completos).

### 7.3 Budgets (`/budgets`)

Grid de cards por categoría mostrando barra de progreso estilo termómetro vintage. Colores cambian de verde → arena → rojo según el porcentaje gastado.

### 7.4 Habits (`/habits`)

Cards de hábitos con calendar heatmap estilo "stamp collection". Cada día completado es un sello dorado. Las rachas activas tienen un badge animado con llama. Botón toggle grande para marcar el día de hoy.

---

## 8. Setup y Ejecución

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
flask db init
flask db migrate -m "initial"
flask db upgrade
python run.py                     # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                       # http://localhost:5173
```

### `requirements.txt`

```
Flask==3.1.*
Flask-SQLAlchemy==3.1.*
Flask-Migrate==4.1.*
Flask-CORS==5.0.*
Flask-Marshmallow==1.2.*
marshmallow-sqlalchemy==1.1.*
```

### `package.json` (deps clave)

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-router": "^1.x",
    "zustand": "^5.x",
    "recharts": "^2.x",
    "axios": "^1.x",
    "date-fns": "^4.x",
    "clsx": "^2.x"
  },
  "devDependencies": {
    "vite": "^6.x",
    "@vitejs/plugin-react": "^4.x",
    "tailwindcss": "^4.x",
    "autoprefixer": "^10.x"
  }
}
```

---

## 9. Milestones de Desarrollo

| #  | Milestone                      | Entregable                              |
|----|--------------------------------|-----------------------------------------|
| 1  | **Skeleton**                   | Flask app factory + React scaffold + DB |
| 2  | **CRUD Finanzas**              | Transactions + Categories endpoints + UI|
| 3  | **Budgets**                    | Budget CRUD + progress bars             |
| 4  | **Habits Engine**              | Habit CRUD + daily logging + streaks    |
| 5  | **Dashboard**                  | Aggregations API + charts + summary     |
| 6  | **Visual Polish**              | Texturas, animaciones, badges, fonts    |
| 7  | **QA + Edge Cases**            | Validaciones, empty states, responsive  |

---

## 10. Notas Adicionales

- **Auth:** No incluido. Es single-user local. Se puede agregar Flask-Login después.
- **Deploy:** SQLite funciona perfecto para uso personal. Para multi-user, migrar a PostgreSQL.
- **Responsive:** Mobile-first. El sidebar colapsa a bottom nav en móvil.
- **Dark mode:** No prioritario — la estética Camel es inherentemente light/warm. Se podría hacer una variante "midnight desert" después.
- **Exportar:** Considerar CSV export de transacciones en milestone 7.
