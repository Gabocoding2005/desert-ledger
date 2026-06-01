# Lista de Verificación — Proyecto Final SO

Marca cada punto conforme completes el proyecto.

## Scripts y Funcionalidad

- [ ] `chmod +x scripts/*.sh` ejecutado correctamente
- [ ] `./scripts/setup.sh` se ejecuta sin errores
- [ ] `./scripts/backup.sh` crea un archivo `.tar.gz` en `backups/`
- [ ] `./scripts/rotar_backups.sh` elimina backups excedentes
- [ ] `./scripts/analizar_access.sh` genera `reportes/reporte_access.txt`
- [ ] `./scripts/analizar_error.sh` genera `reportes/reporte_error.txt`
- [ ] `./scripts/reporte_final.sh` genera `reportes/reporte_final.md`
- [ ] `./scripts/menu.sh` muestra el menú interactivo

## Evidencias generadas

- [ ] `evidencia/setup_estructura.txt` existe y no está vacío
- [ ] `evidencia/backup_ejecucion.txt` existe y no está vacío
- [ ] `evidencia/rotacion.txt` existe y no está vacío
- [ ] `evidencia/cron.txt` existe y no está vacío
- [ ] `reportes/reporte_access.txt` existe y no está vacío
- [ ] `reportes/reporte_error.txt` existe y no está vacío
- [ ] `reportes/reporte_final.md` existe y tiene formato Markdown

## Análisis de access.log

- [ ] Muestra total de peticiones
- [ ] Muestra distribución de códigos HTTP
- [ ] Muestra métodos HTTP
- [ ] Muestra top 10 IPs más activas
- [ ] Muestra top 10 URLs más visitadas
- [ ] Muestra distribución por hora
- [ ] Detecta IPs con alto volumen (> umbral)
- [ ] Detecta IPs con muchos 404 (escáneres)
- [ ] Detecta accesos a rutas sensibles

## Análisis de error.log

- [ ] Cuenta errores por nivel de severidad
- [ ] Lista errores críticos/fatales
- [ ] Detecta errores PHP
- [ ] Detecta errores de base de datos
- [ ] Detecta IPs con accesos denegados
- [ ] Muestra reinicios del servidor

## Respaldos

- [ ] Se crean backups con formato `backup_sitio_YYYYMMDD_HHMMSS.tar.gz`
- [ ] La rotación conserva exactamente MAX_BACKUPS archivos
- [ ] Los backups se pueden restaurar con `tar -xzf`

## Configuración

- [ ] `config.conf` tiene variables correctas para el equipo
- [ ] `ALUMNOS.md` está completado con datos reales
- [ ] Cron configurado (o evidencia de la configuración)

## Entrega

- [ ] Proyecto empaquetado como `proyecto_final_so_NOMBREEQUIPO.tar.gz`
- [ ] Archivo ejecutable desde raíz del proyecto
- [ ] Sin archivos temporales innecesarios

---

**Fecha de verificación:** _______________
**Firma del equipo:** _______________
