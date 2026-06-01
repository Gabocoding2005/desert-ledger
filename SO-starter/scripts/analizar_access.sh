#!/usr/bin/env bash
# analizar_access.sh — Analiza access.log para detectar actividad normal y sospechosa.
# Uso: ./scripts/analizar_access.sh

source ./config.conf
source ./scripts/lib.sh

check_project_root
check_file "$ACCESS_LOG"

titulo "ANÁLISIS DE ACCESS.LOG"
echo "  Equipo  : $EQUIPO"
echo "  Log     : $ACCESS_LOG"
echo "  Fecha   : $(date)"
echo ""

check_dir "$REPORTES_DIR"

REPORTE="$REPORTES_DIR/reporte_access.txt"

# ── Función auxiliar: sección con título ─────────────────────────────────────
seccion() { echo ""; echo "[$1]"; echo "$(printf '─%.0s' {1..50})"; }

# ── Generar reporte ───────────────────────────────────────────────────────────
{
    echo "======================================================"
    echo "  REPORTE DE ANÁLISIS — access.log"
    echo "======================================================"
    echo "Equipo   : $EQUIPO"
    echo "Archivo  : $ACCESS_LOG"
    echo "Generado : $(date)"

    # ── TODO-1: Total de peticiones ──────────────────────────────────────────
    seccion "1. RESUMEN GENERAL"
    TOTAL=$(wc -l < "$ACCESS_LOG")
    echo "Total de peticiones: $TOTAL"

    BYTES_TOTAL=$(awk '{sum += $10} END {print sum+0}' "$ACCESS_LOG")
    echo "Bytes transferidos : $BYTES_TOTAL bytes"

    FECHA_PRIMERA=$(awk 'NR==1 {print $4}' "$ACCESS_LOG" | tr -d '[' | cut -d: -f1)
    FECHA_ULTIMA=$(awk 'END {print $4}' "$ACCESS_LOG" | tr -d '[' | cut -d: -f1)
    echo "Primera entrada    : $FECHA_PRIMERA"
    echo "Última entrada     : $FECHA_ULTIMA"

    # ── TODO-2: Distribución de códigos HTTP ─────────────────────────────────
    seccion "2. DISTRIBUCIÓN DE CÓDIGOS HTTP"
    awk '{print $9}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | \
        awk '{printf "  %-6s → %4d peticiones\n", $2, $1}'

    # ── TODO-3: Métodos HTTP ─────────────────────────────────────────────────
    seccion "3. MÉTODOS HTTP"
    awk '{gsub(/"/, "", $6); print $6}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | \
        awk '{printf "  %-8s → %4d peticiones\n", $2, $1}'

    # ── TODO-4: Top 10 IPs más activas ───────────────────────────────────────
    seccion "4. TOP 10 IPs MÁS ACTIVAS"
    awk '{print $1}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | head -10 | \
        awk '{printf "  %-18s → %4d peticiones\n", $2, $1}'

    # ── TODO-5: Top 10 URLs más solicitadas ──────────────────────────────────
    seccion "5. TOP 10 URLs MÁS SOLICITADAS"
    awk '{print $7}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | head -10 | \
        awk '{printf "  %4d  %s\n", $1, $2}'

    # ── TODO-6: Distribución por hora ────────────────────────────────────────
    seccion "6. PETICIONES POR HORA DEL DÍA"
    awk '{print $4}' "$ACCESS_LOG" | cut -d: -f2 | sort | uniq -c | sort -k2 -n | \
        awk '{printf "  Hora %s:xx → %4d peticiones\n", $2, $1}'

    # ── TODO-7: Errores 404 — páginas no encontradas ─────────────────────────
    seccion "7. PÁGINAS NO ENCONTRADAS (404)"
    TOTAL_404=$(awk '$9 == "404"' "$ACCESS_LOG" | wc -l)
    echo "Total de errores 404: $TOTAL_404"
    echo ""
    echo "  URLs que generan 404:"
    awk '$9 == "404" {print $7}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | head -15 | \
        awk '{printf "  %4d  %s\n", $1, $2}'

    # ── TODO-8: Errores 500 — fallos del servidor ─────────────────────────────
    seccion "8. ERRORES DE SERVIDOR (5xx)"
    TOTAL_5XX=$(awk '$9 >= 500 && $9 < 600' "$ACCESS_LOG" | wc -l)
    echo "Total de errores 5xx: $TOTAL_5XX"
    echo ""
    awk '$9 >= 500 && $9 < 600 {print $9, $7, $1, $4}' "$ACCESS_LOG" | sort | \
        awk '{printf "  [%s] %-6s %-35s %s\n", $4, $1, $2, $3}' | tr -d '[]'  | head -20

    # ── TODO-9: IPs sospechosas — alto volumen ────────────────────────────────
    seccion "9. IPs SOSPECHOSAS — ALTO VOLUMEN (> $UMBRAL_IP peticiones)"
    SOSPECHOSAS_VOL=$(awk '{print $1}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | \
        awk -v umbral="$UMBRAL_IP" '$1 > umbral {print}')

    if [[ -z "$SOSPECHOSAS_VOL" ]]; then
        echo "  Ninguna IP supera el umbral de $UMBRAL_IP peticiones."
    else
        echo "$SOSPECHOSAS_VOL" | awk '{printf "  *** %-18s → %4d peticiones\n", $2, $1}'
    fi

    # ── TODO-10: IPs con muchos 404 — posibles escáneres ─────────────────────
    seccion "10. IPs ESCÁNER — MUCHOS 404 (> $UMBRAL_404 errores 404)"
    SOSPECHOSAS_404=$(awk '$9 == "404" {print $1}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | \
        awk -v umbral="$UMBRAL_404" '$1 > umbral {print}')

    if [[ -z "$SOSPECHOSAS_404" ]]; then
        echo "  Ninguna IP supera el umbral de $UMBRAL_404 errores 404."
    else
        echo "$SOSPECHOSAS_404" | awk '{printf "  *** ESCÁNER %-18s → %4d errores 404\n", $2, $1}'
    fi

    # ── TODO-11: Actividad fuera de horario (00:00–05:59) ────────────────────
    seccion "11. ACTIVIDAD NOCTURNA SOSPECHOSA (00:00 — 05:59)"
    NOCTURNAS=$(awk '{
        hora = substr($4, index($4,":")+1, 2)
        if (hora+0 >= 0 && hora+0 <= 5) print $0
    }' "$ACCESS_LOG")

    TOTAL_NOCT=$(echo "$NOCTURNAS" | grep -c "." || echo 0)
    echo "Peticiones entre 00:00-05:59: $TOTAL_NOCT"
    echo ""
    echo "  IPs activas de madrugada:"
    echo "$NOCTURNAS" | awk '{print $1}' | sort | uniq -c | sort -rn | head -10 | \
        awk '{printf "  %-18s → %4d peticiones\n", $2, $1}'

    # ── TODO-12: User Agents sospechosos ─────────────────────────────────────
    seccion "12. USER AGENTS INUSUALES"
    echo "  Herramientas de escaneo / automatización detectadas:"
    grep -oP '"[^"]*"$' "$ACCESS_LOG" | sort | uniq -c | sort -rn | \
        grep -v -i "mozilla\|chrome\|firefox\|safari\|webkit\|googlebot\|bingbot\|monit" | \
        head -10 | awk '{printf "  %4d  %s\n", $1, $0}'

    # ── TODO-13: Intentos de acceso a recursos sensibles ─────────────────────
    seccion "13. ACCESOS A RUTAS SENSIBLES"
    echo "  Intentos de acceso a rutas potencialmente peligrosas:"
    grep -E '(/\.env|/\.git|/wp-admin|/wp-login|/phpmyadmin|/admin|/config\.php|\.sql|/shell|/c99|/r57|/etc/passwd|/\.htpasswd|UNION|SELECT|script>)' \
        "$ACCESS_LOG" | \
        awk '{print $1, $7}' | sort | uniq -c | sort -rn | head -20 | \
        awk '{printf "  %4d  %-18s  %s\n", $1, $2, $3}'

    echo ""
    echo "======================================================"
    echo "  FIN DEL REPORTE ACCESS.LOG"
    echo "======================================================"

} | tee "$REPORTE"

log_msg "OK" "Reporte guardado en: $REPORTE"
separador
