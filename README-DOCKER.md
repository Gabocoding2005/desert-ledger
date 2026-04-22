# 🐫 Desert Ledger - Docker Setup

## Ejecutar con Docker

La manera más sencilla de correr la aplicación completa es usando Docker Compose.

### Requisitos

- Docker
- Docker Compose

### Inicio Rápido

1. **Levantar todos los servicios:**

```bash
docker-compose up
```

Esto iniciará:
- **PostgreSQL** en el puerto `5432`
- **Backend (Flask)** en el puerto `5000`
- **Frontend (Vite)** en el puerto `5173`

2. **Acceder a la aplicación:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Comandos Útiles

**Levantar en segundo plano:**
```bash
docker-compose up -d
```

**Ver logs:**
```bash
docker-compose logs -f
```

**Ver logs de un servicio específico:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

**Detener los servicios:**
```bash
docker-compose down
```

**Detener y eliminar volúmenes (elimina la base de datos):**
```bash
docker-compose down -v
```

**Reconstruir las imágenes:**
```bash
docker-compose build
```

**Reconstruir y levantar:**
```bash
docker-compose up --build
```

### Estructura de Servicios

- **db**: PostgreSQL 15
  - Usuario: `postgres`
  - Contraseña: `postgres`
  - Base de datos: `desert_ledger`

- **backend**: Flask API
  - Inicializa automáticamente las tablas de la base de datos
  - Hot-reload activado (detecta cambios en el código)

- **frontend**: Vite + React
  - Hot-reload activado (detecta cambios en el código)

### Notas

- Los cambios en el código se reflejan automáticamente sin necesidad de reconstruir las imágenes
- La base de datos persiste en un volumen de Docker llamado `postgres_data`
- Para resetear la base de datos, ejecuta `docker-compose down -v`
