#!/usr/bin/env bash
# rotar_backups.sh — Elimina respaldos antiguos, conservando solo los más recientes.
# Uso: ./scripts/rotar_backups.sh

source ./config.conf
source ./scripts/lib.sh

check_project_root

titulo "ROTACIÓN DE BACKUPS"
echo "  Equipo         : $EQUIPO"
echo "  Fecha          : $(date)"
echo "  Backups a retener: $MAX_BACKUPS"
echo ""

check_dir "$BACKUPS_DIR"
check_dir "$EVIDENCIA_DIR"

EVIDENCIA_FILE="$EVIDENCIA_DIR/rotacion.txt"

# ── TODO-1: Contar backups actuales ──────────────────────────────────────────
TOTAL_ANTES=$(find "$BACKUPS_DIR" -name "${BACKUP_PREFIX}_*.tar.gz" | wc -l)
log_msg "INFO" "Backups encontrados antes de rotar: $TOTAL_ANTES"

echo ""
echo "  Backups actuales (orden cronológico):"
find "$BACKUPS_DIR" -name "${BACKUP_PREFIX}_*.tar.gz" -printf "    %T+ %f\n" | sort

# ── TODO-2: Determinar cuáles borrar ─────────────────────────────────────────
# Ordenar por fecha (más nuevos primero), saltar los MAX_BACKUPS primeros,
# los restantes son candidatos a eliminar.
BACKUPS_A_BORRAR=$(find "$BACKUPS_DIR" -name "${BACKUP_PREFIX}_*.tar.gz" -printf "%T@ %p\n" \
    | sort -rn \
    | awk -v max="$MAX_BACKUPS" 'NR > max {print $2}')

# ── TODO-3: Eliminar backups viejos ──────────────────────────────────────────
ELIMINADOS=0
if [[ -z "$BACKUPS_A_BORRAR" ]]; then
    log_msg "INFO" "No hay backups que eliminar (hay $TOTAL_ANTES, máximo es $MAX_BACKUPS)."
else
    echo ""
    log_msg "INFO" "Eliminando backups antiguos..."
    while IFS= read -r archivo; do
        nombre=$(basename "$archivo")
        tamano=$(du -sh "$archivo" | cut -f1)
        rm "$archivo"
        if [[ $? -eq 0 ]]; then
            log_msg "OK"   "Eliminado: $nombre ($tamano)"
            (( ELIMINADOS++ ))
        else
            log_msg "WARN" "No se pudo eliminar: $nombre"
        fi
    done <<< "$BACKUPS_A_BORRAR"
fi

# ── TODO-4: Contar backups restantes ─────────────────────────────────────────
TOTAL_DESPUES=$(find "$BACKUPS_DIR" -name "${BACKUP_PREFIX}_*.tar.gz" | wc -l)

echo ""
echo "  Backups restantes ($TOTAL_DESPUES):"
find "$BACKUPS_DIR" -name "${BACKUP_PREFIX}_*.tar.gz" -printf "    %T+ %f\n" | sort

# ── TODO-5: Generar evidencia ────────────────────────────────────────────────
{
    echo "======================================================"
    echo "  EVIDENCIA DE ROTACIÓN DE BACKUPS"
    echo "======================================================"
    echo "Equipo            : $EQUIPO"
    echo "Fecha             : $(date)"
    echo "MAX_BACKUPS       : $MAX_BACKUPS"
    echo "Backups antes     : $TOTAL_ANTES"
    echo "Backups eliminados: $ELIMINADOS"
    echo "Backups después   : $TOTAL_DESPUES"
    echo ""
    echo "--- Backups conservados ---"
    find "$BACKUPS_DIR" -name "${BACKUP_PREFIX}_*.tar.gz" -printf "%T+ %f  (%s bytes)\n" | sort
    echo ""
    echo "--- Uso de disco en backups ---"
    du -sh "$BACKUPS_DIR" 2>/dev/null || echo "(no hay backups)"
} | tee "$EVIDENCIA_FILE"

log_msg "OK" "Rotación completada. Evidencia en: $EVIDENCIA_FILE"
separador
