#!/usr/bin/env bash
# analizar_error.sh — Analiza error.log para identificar errores relevantes del servidor.
# Uso: ./scripts/analizar_error.sh

source ./config.conf
source ./scripts/lib.sh

check_project_root
check_file "$ERROR_LOG"

titulo "ANÁLISIS DE ERROR.LOG"
echo "  Equipo  : $EQUIPO"
echo "  Log     : $ERROR_LOG"
echo "  Fecha   : $(date)"
echo ""

check_dir "$REPORTES_DIR"

REPORTE="$REPORTES_DIR/reporte_error.txt"

seccion() { echo ""; echo "[$1]"; echo "$(printf '─%.0s' {1..50})"; }

{
    echo "======================================================"
    echo "  REPORTE DE ANÁLISIS — error.log"
    echo "======================================================"
    echo "Equipo   : $EQUIPO"
    echo "Archivo  : $ERROR_LOG"
    echo "Generado : $(date)"

    # ── TODO-1: Resumen general ───────────────────────────────────────────────
    seccion "1. RESUMEN GENERAL"
    TOTAL=$(wc -l < "$ERROR_LOG")
    echo "Total de líneas en error.log : $TOTAL"

    # ── TODO-2: Conteo por nivel de severidad ─────────────────────────────────
    seccion "2. ERRORES POR NIVEL DE SEVERIDAD"
    echo "  (emerg > alert > crit > error > warn > notice > info)"
    echo ""
    for nivel in emerg alert crit error warn notice info; do
        CUENTA=$(grep -ci ":${nivel}" "$ERROR_LOG" 2>/dev/null)
        CUENTA=${CUENTA:-0}
        if (( CUENTA > 0 )); then
            printf "  %-8s → %4d líneas\n" "$nivel" "$CUENTA"
        fi
    done

    # ── TODO-3: Errores críticos y de error (más graves) ─────────────────────
    seccion "3. ERRORES CRÍTICOS Y GRAVES (crit / error)"
    grep -i ":\(crit\|error\)" "$ERROR_LOG" | head -20 | \
        while IFS= read -r linea; do
            echo "  $linea"
        done

    # ── TODO-4: Errores PHP ───────────────────────────────────────────────────
    seccion "4. ERRORES PHP"
    TOTAL_PHP=$(grep -ci "\[php:" "$ERROR_LOG")
    echo "Total de errores PHP: $TOTAL_PHP"
    echo ""

    echo "  PHP Fatal errors:"
    grep -i "\[php:" "$ERROR_LOG" | grep -i "fatal" | wc -l | \
        xargs -I{} echo "    Cantidad: {}"
    grep -i "\[php:" "$ERROR_LOG" | grep -i "fatal" | head -8 | \
        awk '{for(i=4;i<=NF;i++) printf $i" "; print ""}' | \
        while IFS= read -r msg; do echo "    $msg"; done

    echo ""
    echo "  PHP Warnings:"
    grep -i "\[php:warn\]" "$ERROR_LOG" | wc -l | xargs -I{} echo "    Cantidad: {}"

    echo ""
    echo "  Archivos PHP con errores frecuentes:"
    grep -i "\[php:" "$ERROR_LOG" | grep -oP '/\S+\.php' | sort | uniq -c | sort -rn | head -8 | \
        awk '{printf "  %4d  %s\n", $1, $2}'

    # ── TODO-5: Errores de base de datos ─────────────────────────────────────
    seccion "5. ERRORES DE BASE DE DATOS"
    TOTAL_DB=$(grep -ci "SQLSTATE\|PDOException\|database\|Connection refused" "$ERROR_LOG")
    echo "Errores relacionados con DB: $TOTAL_DB"
    echo ""
    grep -i "SQLSTATE\|PDOException\|database\|Connection refused" "$ERROR_LOG" | head -10 | \
        while IFS= read -r linea; do echo "  $linea"; done

    # ── TODO-6: Errores de autenticación / acceso denegado ────────────────────
    seccion "6. ACCESOS DENEGADOS (authz_core:error)"
    TOTAL_AUTH=$(grep -ci "authz_core:error\|AH01630" "$ERROR_LOG")
    echo "Total de accesos denegados: $TOTAL_AUTH"
    echo ""
    echo "  IPs con más accesos denegados:"
    grep -i "AH01630" "$ERROR_LOG" | grep -oP 'client \K[\d.]+' | \
        sort | uniq -c | sort -rn | head -10 | \
        awk '{printf "  %-18s → %4d denegados\n", $2, $1}'

    echo ""
    echo "  Rutas más bloqueadas:"
    grep -i "AH01630" "$ERROR_LOG" | grep -oP 'configuration: /\S+' | \
        sort | uniq -c | sort -rn | head -10 | \
        awk '{printf "  %4d  %s\n", $1, $2}'

    # ── TODO-7: Reinicios del servidor ────────────────────────────────────────
    seccion "7. REINICIOS / EVENTOS DEL SERVIDOR APACHE"
    grep -i "mpm_prefork:notice\|graceful restart\|resuming normal\|configured" "$ERROR_LOG" | \
        while IFS= read -r linea; do echo "  $linea"; done

    # ── TODO-8: Errores SSL ───────────────────────────────────────────────────
    seccion "8. ERRORES SSL / TLS"
    TOTAL_SSL=$(grep -ci "ssl:\|SSL\|TLS" "$ERROR_LOG")
    echo "Errores SSL/TLS: $TOTAL_SSL"
    grep -i "ssl:\|SSL\|TLS" "$ERROR_LOG" | head -8 | \
        while IFS= read -r linea; do echo "  $linea"; done

    # ── TODO-9: Recursos con problemas ────────────────────────────────────────
    seccion "9. RECURSOS FALTANTES O CON PROBLEMAS"
    grep -i "No such file\|Cannot serve directory\|Cannot open" "$ERROR_LOG" | head -10 | \
        while IFS= read -r linea; do echo "  $linea"; done

    # ── TODO-10: Últimos 10 errores registrados ───────────────────────────────
    seccion "10. ÚLTIMAS 10 ENTRADAS EN ERROR.LOG"
    tail -10 "$ERROR_LOG" | while IFS= read -r linea; do echo "  $linea"; done

    echo ""
    echo "======================================================"
    echo "  FIN DEL REPORTE ERROR.LOG"
    echo "======================================================"

} | tee "$REPORTE"

log_msg "OK" "Reporte guardado en: $REPORTE"
separador
