# Instrucciones del Proyecto Final — Sistemas Operativos

## Objetivo

Construir un sistema Bash que automatice:
- Generación de evidencia del entorno de trabajo
- Creación de respaldos comprimidos de una carpeta web simulada
- Rotación de respaldos conservando solo los más recientes
- Análisis de `access.log` para detectar actividad normal y sospechosa
- Análisis de `error.log` para identificar errores del servidor
- Programación de tareas automáticas con cron
- Generación de un reporte final en Markdown

---

## Orden de trabajo

```
1. chmod +x scripts/*.sh
2. ./scripts/setup.sh          → Genera estructura y evidencia/setup_estructura.txt
3. ./scripts/backup.sh         → Genera backups/ y evidencia/backup_ejecucion.txt
4. ./scripts/rotar_backups.sh  → Rota backups y genera evidencia/rotacion.txt
5. ./scripts/analizar_access.sh → Genera reportes/reporte_access.txt
6. ./scripts/analizar_error.sh  → Genera reportes/reporte_error.txt
7. ./scripts/reporte_final.sh   → Genera reportes/reporte_final.md + evidencia/cron.txt
8. (Opcional) ./scripts/menu.sh → Menú interactivo
```

> **Todos los scripts se ejecutan desde la raíz del proyecto** (donde está `config.conf`).

---

## TODOs numerados

Los scripts incluyen comentarios `TODO-N` que indican las secciones clave:

### backup.sh
- `TODO-1`: Verificar que sitio_web existe
- `TODO-2`: Asegurar que el directorio de backups existe
- `TODO-3`: Generar nombre con timestamp usando `$(date +"$FECHA_FORMAT")`
- `TODO-4`: Crear respaldo con `tar -czf`
- `TODO-5`: Verificar código de salida `$?`
- `TODO-6`: Mostrar tamaño con `du -sh`
- `TODO-7`: Listar backups actuales con `find`
- `TODO-8`: Guardar evidencia con `tee`

### rotar_backups.sh
- `TODO-1`: Contar backups con `find ... | wc -l`
- `TODO-2`: Determinar cuáles borrar (ordenar por fecha, descartar los N más nuevos)
- `TODO-3`: Eliminar con `rm`
- `TODO-4`: Contar los restantes
- `TODO-5`: Guardar evidencia

### analizar_access.sh
- `TODO-1` al `TODO-13`: Análisis completo usando `grep`, `awk`, `sort`, `uniq`, `cut`, `head`, `wc`

### analizar_error.sh
- `TODO-1` al `TODO-10`: Análisis de errores usando `grep`, `awk`, `cut`, `sort`, `uniq`, `tail`

### reporte_final.sh
- Consolidar todo en `reportes/reporte_final.md` en formato Markdown

---

## Comandos clave que DEBES usar

| Comando | Uso en el proyecto |
|---|---|
| `grep` | Buscar patrones en logs |
| `awk` | Extraer campos específicos (IP=$1, código=$9, etc.) |
| `cut` | Extraer partes de strings (horas, fechas) |
| `sort` | Ordenar resultados |
| `uniq -c` | Contar ocurrencias únicas |
| `head` / `tail` | Primeras/últimas líneas |
| `wc -l` | Contar líneas |
| `find` | Buscar archivos por patrón o antigüedad |
| `tar -czf` | Crear backup comprimido |
| `chmod` | Dar permisos de ejecución |
| `tee` | Mostrar y guardar salida simultáneamente |
| `date` | Obtener timestamp para nombres de archivo |
| `crontab` | Programar tareas automáticas |

---

## Restricciones

- No modificar `logs/access.log` ni `logs/error.log`
- No usar Python, Node.js ni herramientas externas
- Todo el procesamiento debe ser Bash + comandos Linux
- Los scripts se ejecutan desde la raíz del proyecto

---

## Entrega

```bash
tar -czf proyecto_final_so_COBRA_REAL.tar.gz SO-starter/
```
