#!/usr/bin/env bash
# backup.sh — Crea un respaldo comprimido (.tar.gz) de sitio_web.
# Uso: ./scripts/backup.sh

source ./config.conf
source ./scripts/lib.sh

check_project_root

titulo "BACKUP — Creación de Respaldo"
echo "  Equipo : $EQUIPO"
echo "  Fecha  : $(date)"
echo ""

# ── TODO-1: Verificar que el directorio fuente existe ────────────────────────
if [[ ! -d "$SITIO_WEB" ]]; then
    log_msg "ERROR" "El directorio '$SITIO_WEB' no existe. Ejecuta setup.sh primero."
    exit 1
fi
log_msg "INFO" "Directorio fuente verificado: $SITIO_WEB"

# ── TODO-2: Asegurar que el directorio de backups existe ─────────────────────
check_dir "$BACKUPS_DIR"
check_dir "$EVIDENCIA_DIR"

# ── TODO-3: Generar nombre de archivo con timestamp ──────────────────────────
TIMESTAMP=$(date +"$FECHA_FORMAT")
ARCHIVO_BACKUP="${BACKUPS_DIR}/${BACKUP_PREFIX}_${TIMESTAMP}.tar.gz"
log_msg "INFO" "Nombre del backup: $ARCHIVO_BACKUP"

# ── TODO-4: Crear el respaldo usando tar ─────────────────────────────────────
log_msg "INFO" "Creando backup..."
tar -czf "$ARCHIVO_BACKUP" "$SITIO_WEB"
RESULTADO=$?

# ── TODO-5: Verificar que el backup se creó correctamente ────────────────────
if [[ $RESULTADO -ne 0 ]]; then
    log_msg "ERROR" "Falló la creación del backup (código de salida: $RESULTADO)."
    exit 1
fi

if [[ ! -f "$ARCHIVO_BACKUP" ]]; then
    log_msg "ERROR" "El archivo de backup no fue creado."
    exit 1
fi

# ── TODO-6: Mostrar información del backup creado ────────────────────────────
TAMANO=$(du -sh "$ARCHIVO_BACKUP" | cut -f1)
ARCHIVOS=$(tar -tzf "$ARCHIVO_BACKUP" | wc -l)

log_msg "OK" "Backup creado exitosamente."
echo ""
echo "  Archivo  : $ARCHIVO_BACKUP"
echo "  Tamaño   : $TAMANO"
echo "  Archivos : $ARCHIVOS contenidos"
echo ""

# ── TODO-7: Listar todos los backups existentes ──────────────────────────────
echo "  Backups actuales en $BACKUPS_DIR:"
find "$BACKUPS_DIR" -name "${BACKUP_PREFIX}_*.tar.gz" -printf "    %f  (%s bytes)\n" | sort

# ── TODO-8: Generar evidencia ────────────────────────────────────────────────
EVIDENCIA_FILE="$EVIDENCIA_DIR/backup_ejecucion.txt"
{
    echo "======================================================"
    echo "  EVIDENCIA DE BACKUP"
    echo "======================================================"
    echo "Equipo    : $EQUIPO"
    echo "Fecha     : $(date)"
    echo "Archivo   : $ARCHIVO_BACKUP"
    echo "Tamaño    : $TAMANO"
    echo "Archivos  : $ARCHIVOS"
    echo ""
    echo "--- Contenido del backup ---"
    tar -tzf "$ARCHIVO_BACKUP" | head -30
    echo ""
    echo "--- Backups en $BACKUPS_DIR ---"
    ls -lh "$BACKUPS_DIR/"
    echo ""
    echo "--- Hash MD5 del backup ---"
    md5sum "$ARCHIVO_BACKUP" 2>/dev/null || echo "(md5sum no disponible)"
} | tee "$EVIDENCIA_FILE"

log_msg "OK" "Evidencia guardada en: $EVIDENCIA_FILE"
separador
