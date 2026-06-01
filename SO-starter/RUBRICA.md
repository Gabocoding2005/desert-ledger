# Rúbrica de Evaluación — Proyecto Final SO

| # | Criterio | Puntos | Indicadores |
|---|---|---|---|
| 1 | **setup.sh** | 10 | Crea directorios correctamente, genera `evidencia/setup_estructura.txt` con estructura del proyecto, permisos y variables |
| 2 | **backup.sh** | 15 | Crea `.tar.gz` con timestamp, verifica existencia de directorios, muestra tamaño, genera `evidencia/backup_ejecucion.txt` |
| 3 | **rotar_backups.sh** | 15 | Conserva exactamente `MAX_BACKUPS` backups, elimina los más viejos, genera `evidencia/rotacion.txt` |
| 4 | **analizar_access.sh** | 20 | Usa `grep/awk/sort/uniq` para: total de peticiones, top IPs, top URLs, distribución de códigos, horarios, IPs sospechosas, escáneres, rutas sensibles |
| 5 | **analizar_error.sh** | 15 | Clasifica errores por severidad, detecta errores PHP y DB, encuentra IPs con accesos denegados, usa `grep/awk/tail` |
| 6 | **reporte_final.sh** | 15 | Genera `reporte_final.md` en Markdown con tablas, hallazgos, recomendaciones y configuración de cron |
| 7 | **cron** | 5 | Evidencia de `crontab -l` y/o configuración de tareas en `evidencia/cron.txt` |
| 8 | **Calidad general** | 5 | Scripts con `source lib.sh`, manejo de errores, uso de `tee`, colores/formato, código limpio |
| **Total** | | **100** | |

## Penalizaciones
- -10 pts por modificar `logs/access.log` o `logs/error.log`
- -10 pts por usar Python/Node.js en lugar de Bash
- -5 pts por script que no se puede ejecutar
- -5 pts por falta de evidencia requerida
