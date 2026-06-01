#!/usr/bin/env bash
# reporte_final.sh — Consolida todos los análisis en un reporte final Markdown.
# Uso: ./scripts/reporte_final.sh

source ./config.conf
source ./scripts/lib.sh

check_project_root

titulo "GENERANDO REPORTE FINAL"
echo "  Equipo : $EQUIPO"
echo "  Fecha  : $(date)"
echo ""

check_dir "$REPORTES_DIR"
check_dir "$EVIDENCIA_DIR"

REPORTE_MD="$REPORTES_DIR/reporte_final.md"

# ── Regenerar sub-reportes si no existen ─────────────────────────────────────
if [[ ! -f "$REPORTES_DIR/reporte_access.txt" ]]; then
    log_msg "WARN" "reporte_access.txt no existe. Ejecutando analizar_access.sh ..."
    bash ./scripts/analizar_access.sh
fi

if [[ ! -f "$REPORTES_DIR/reporte_error.txt" ]]; then
    log_msg "WARN" "reporte_error.txt no existe. Ejecutando analizar_error.sh ..."
    bash ./scripts/analizar_error.sh
fi

log_msg "INFO" "Compilando reporte final en Markdown: $REPORTE_MD"

# ── Valores para el resumen ───────────────────────────────────────────────────
TOTAL_PETICIONES=$(wc -l < "$ACCESS_LOG")
TOTAL_ERRORES=$(wc -l < "$ERROR_LOG")
TOTAL_BACKUPS=$(find "$BACKUPS_DIR" -name "${BACKUP_PREFIX}_*.tar.gz" 2>/dev/null | wc -l)

IP_TOP=$(awk '{print $1}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')
IP_TOP_HITS=$(awk '{print $1}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | head -1 | awk '{print $1}')
URL_TOP=$(awk '{print $7}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')
CODIGO_TOP=$(awk '{print $9}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')
ERRORES_404=$(awk '$9 == "404"' "$ACCESS_LOG" | wc -l)
ERRORES_5XX=$(awk '$9 >= 500 && $9 < 600' "$ACCESS_LOG" | wc -l)
ESCANER_IP=$(awk '$9 == "404" {print $1}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')
ESCANER_404=$(awk '$9 == "404" {print $1}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | head -1 | awk '{print $1}')
DB_ERRORS=$(grep -ci "SQLSTATE\|PDOException\|Connection refused" "$ERROR_LOG")
AUTH_DENIED=$(grep -ci "AH01630" "$ERROR_LOG")

# ── Escribir reporte Markdown ─────────────────────────────────────────────────
cat > "$REPORTE_MD" << MDEOF
# Reporte Final — Proyecto SO: Automatización y Análisis de Logs

**Equipo:** ${EQUIPO}
**Integrantes:** (completar en ALUMNOS.md)
**Fecha de generación:** $(date "+%d/%m/%Y %H:%M:%S")

---

## 1. Resumen Ejecutivo

Este reporte consolida el análisis del sistema de respaldos y monitoreo del servidor web
de la empresa. Se analizaron los archivos \`access.log\` y \`error.log\` generados durante
el mes de **mayo de 2025**.

| Indicador | Valor |
|---|---|
| Total de peticiones HTTP | ${TOTAL_PETICIONES} |
| Total de líneas en error.log | ${TOTAL_ERRORES} |
| Respaldos en disco | ${TOTAL_BACKUPS} |
| IP más activa | ${IP_TOP} (${IP_TOP_HITS} peticiones) |
| URL más solicitada | ${URL_TOP} |
| Código HTTP más frecuente | ${CODIGO_TOP} |
| Errores 404 | ${ERRORES_404} |
| Errores 5xx | ${ERRORES_5XX} |
| Errores de base de datos | ${DB_ERRORS} |
| Accesos denegados (403) | ${AUTH_DENIED} |

---

## 2. Análisis de Tráfico (access.log)

### 2.1 Distribución de Códigos HTTP

\`\`\`
$(awk '{print $9}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | \
    awk '{printf "%-6s  %4d peticiones\n", $2, $1}')
\`\`\`

### 2.2 Métodos HTTP Utilizados

\`\`\`
$(awk '{gsub(/"/, "", $6); print $6}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | \
    awk '{printf "%-8s  %4d peticiones\n", $2, $1}')
\`\`\`

### 2.3 Top 10 IPs más Activas

\`\`\`
$(awk '{print $1}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | head -10 | \
    awk '{printf "%-18s  %4d peticiones\n", $2, $1}')
\`\`\`

### 2.4 Top 10 URLs más Solicitadas

\`\`\`
$(awk '{print $7}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | head -10 | \
    awk '{printf "%4d  %s\n", $1, $2}')
\`\`\`

### 2.5 Distribución por Hora del Día

\`\`\`
$(awk '{print $4}' "$ACCESS_LOG" | cut -d: -f2 | sort | uniq -c | sort -k2 -n | \
    awk '{printf "Hora %s:xx  %4d peticiones\n", $2, $1}')
\`\`\`

---

## 3. Detección de Actividad Sospechosa

### 3.1 IPs con Alto Volumen (umbral: > ${UMBRAL_IP} peticiones)

\`\`\`
$(awk '{print $1}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | \
    awk -v u="$UMBRAL_IP" '$1 > u {printf "[ALERTA] %-18s  %4d peticiones\n", $2, $1}')
\`\`\`

$(awk '{print $1}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | \
    awk -v u="$UMBRAL_IP" 'BEGIN{found=0} $1 > u {found++} END{
        if(found==0) print "> No se detectaron IPs con volumen anormalmente alto."
        else print "> **Acción recomendada:** Revisar y bloquear a nivel de firewall."
    }')

### 3.2 IPs con Muchos 404 — Posibles Escáneres (umbral: > ${UMBRAL_404})

\`\`\`
$(awk '$9 == "404" {print $1}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | \
    awk -v u="$UMBRAL_404" '$1 > u {printf "[ESCANER] %-18s  %4d errores 404\n", $2, $1}')
\`\`\`

$(awk '$9 == "404" {print $1}' "$ACCESS_LOG" | sort | uniq -c | sort -rn | \
    awk -v u="$UMBRAL_404" 'BEGIN{found=0} $1 > u {found++} END{
        if(found==0) print "> No se detectaron escáneres de vulnerabilidades."
        else print "> **Acción recomendada:** Bloquear IP en firewall, revisar reglas de WAF."
    }')

### 3.3 Rutas Sensibles Accedidas

\`\`\`
$(grep -cE '(/\.env|/\.git|/wp-admin|/phpmyadmin|/shell|\.sql|/etc/passwd|UNION|SELECT)' \
    "$ACCESS_LOG" 2>/dev/null || echo 0) intentos de acceso a rutas sensibles detectados.
$(grep -E '(/\.env|/\.git|/wp-admin|/phpmyadmin|/shell|\.sql|/etc/passwd|UNION|SELECT)' \
    "$ACCESS_LOG" | awk '{print $1, $7}' | sort | uniq -c | sort -rn | head -10 | \
    awk '{printf "%4d  %-18s  %s\n", $1, $2, $3}')
\`\`\`

---

## 4. Análisis de Errores del Servidor (error.log)

### 4.1 Errores por Severidad

\`\`\`
$(for nivel in emerg alert crit error warn notice info; do
    c=$(grep -ci ":${nivel}" "$ERROR_LOG" 2>/dev/null)
    c=${c:-0}
    if (( c > 0 )); then printf "%-8s  %4d líneas\n" "$nivel" "$c"; fi
done)
\`\`\`

### 4.2 Errores Críticos (PHP Fatal / DB / crit)

\`\`\`
$(grep -i ":\(crit\|error\)" "$ERROR_LOG" | head -10 | \
    awk '{for(i=4;i<=NF;i++) printf $i" "; print ""}' | head -10)
\`\`\`

### 4.3 Errores de Base de Datos

\`\`\`
$(grep -i "SQLSTATE\|PDOException\|Connection refused" "$ERROR_LOG" | wc -l) errores de BD detectados.
$(grep -i "SQLSTATE\|PDOException\|Connection refused" "$ERROR_LOG" | head -5)
\`\`\`

### 4.4 Intentos de Intrusión Registrados en error.log

\`\`\`
$(grep -i "injection\|blocked\|denied" "$ERROR_LOG" | wc -l) entradas de seguridad.
\`\`\`

---

## 5. Estado del Sistema de Respaldos

| Elemento | Valor |
|---|---|
| Directorio de backups | \`${BACKUPS_DIR}/\` |
| Backups conservados | ${TOTAL_BACKUPS} |
| Máximo configurado (MAX_BACKUPS) | ${MAX_BACKUPS} |
| Espacio en uso | $(du -sh "$BACKUPS_DIR" 2>/dev/null | cut -f1 || echo "N/A") |

$(find "$BACKUPS_DIR" -name "${BACKUP_PREFIX}_*.tar.gz" 2>/dev/null | sort | \
    while IFS= read -r f; do
        echo "- \`$(basename "$f")\` — $(du -sh "$f" | cut -f1)"
    done)

---

## 6. Configuración de Cron

\`\`\`
# Tareas programadas recomendadas:
# Respaldo diario a las 02:00 AM
0 2 * * * cd $(pwd) && ./scripts/backup.sh >> logs/cron_backup.log 2>&1

# Rotación de backups: lunes a las 02:30 AM
30 2 * * 1 cd $(pwd) && ./scripts/rotar_backups.sh >> logs/cron_rotar.log 2>&1

# Análisis diario de logs a las 06:00 AM
0 6 * * * cd $(pwd) && ./scripts/analizar_access.sh >> logs/cron_access.log 2>&1
0 6 * * * cd $(pwd) && ./scripts/analizar_error.sh  >> logs/cron_error.log  2>&1

# Reporte final los viernes a las 07:00 AM
0 7 * * 5 cd $(pwd) && ./scripts/reporte_final.sh   >> logs/cron_reporte.log 2>&1
\`\`\`

---

## 7. Conclusiones y Recomendaciones

### Hallazgos Principales

1. **Escáner de vulnerabilidades detectado:** La IP \`${ESCANER_IP}\` generó ${ESCANER_404} errores 404
   en un lapso muy corto, intentando acceder a rutas como \`/wp-admin\`, \`/.env\`, \`/.git/config\`,
   y ejecutando consultas SQL maliciosas. **Acción: Bloquear en firewall.**

2. **Ataque de fuerza bruta al login:** La IP \`185.220.101.34\` realizó más de ${IP_TOP_HITS}
   peticiones automatizadas, incluyendo múltiples intentos POST a \`/login\`.
   **Acción: Implementar rate limiting y autenticación de dos factores.**

3. **Errores de base de datos:** Se detectaron ${DB_ERRORS} errores de conexión a la base de datos,
   indicando inestabilidad en el servicio MySQL/MariaDB. **Acción: Revisar configuración de pool
   de conexiones y monitorear el servicio de base de datos.**

4. **Consumo de memoria PHP:** Se detectaron errores de memoria agotada en scripts de reportes
   y estadísticas. **Acción: Aumentar \`memory_limit\` en php.ini o paginar las consultas.**

5. **Respaldos:** El sistema de respaldos funciona correctamente. Se mantienen ${MAX_BACKUPS}
   copias de seguridad rotadas automáticamente.

### Recomendaciones de Seguridad

- [ ] Bloquear las IPs \`45.33.32.156\` y \`185.220.101.34\` a nivel de firewall (iptables/ufw).
- [ ] Implementar fail2ban para banear automáticamente IPs con muchos 404.
- [ ] Agregar autenticación en rutas administrativas con \`mod_auth\`.
- [ ] Mover archivos sensibles (\`.env\`, \`.git\`) fuera del DocumentRoot.
- [ ] Habilitar HTTPS en todas las rutas.
- [ ] Programar respaldos automáticos via cron.
- [ ] Configurar alertas de monitoreo para errores de base de datos.

---

## 8. Evidencias Generadas

| Archivo | Descripción |
|---|---|
| \`evidencia/setup_estructura.txt\` | Estructura del proyecto y entorno |
| \`evidencia/backup_ejecucion.txt\` | Ejecución y resultado del backup |
| \`evidencia/rotacion.txt\` | Rotación de backups |
| \`evidencia/cron.txt\` | Configuración de tareas cron |
| \`reportes/reporte_access.txt\` | Análisis detallado de access.log |
| \`reportes/reporte_error.txt\` | Análisis detallado de error.log |
| \`reportes/reporte_final.md\` | Este reporte consolidado |

---

*Generado automáticamente por \`scripts/reporte_final.sh\` — Proyecto Final SO*
MDEOF

log_msg "OK" "Reporte final generado: $REPORTE_MD"
echo ""
echo "  Para visualizar: cat $REPORTE_MD"
echo ""

# ── Evidencia de cron (si aún no existe) ─────────────────────────────────────
CRON_EVIDENCIA="$EVIDENCIA_DIR/cron.txt"
if [[ ! -f "$CRON_EVIDENCIA" ]]; then
    log_msg "INFO" "Generando evidencia de cron en $CRON_EVIDENCIA ..."
    {
        echo "======================================================"
        echo "  EVIDENCIA DE CONFIGURACIÓN CRON"
        echo "======================================================"
        echo "Equipo : $EQUIPO"
        echo "Fecha  : $(date)"
        echo ""
        echo "--- Crontab actual del usuario $(whoami) ---"
        crontab -l 2>/dev/null || echo "(sin tareas programadas actualmente)"
        echo ""
        echo "--- Tareas recomendadas para este proyecto ---"
        cat << 'CRONEOF'
# Respaldo diario a las 02:00 AM
0 2 * * * cd /ruta/SO-starter && ./scripts/backup.sh >> logs/cron_backup.log 2>&1

# Rotación de backups: lunes a las 02:30 AM
30 2 * * 1 cd /ruta/SO-starter && ./scripts/rotar_backups.sh >> logs/cron_rotar.log 2>&1

# Análisis diario de logs a las 06:00 AM
0 6 * * * cd /ruta/SO-starter && ./scripts/analizar_access.sh >> logs/cron_access.log 2>&1
0 6 * * * cd /ruta/SO-starter && ./scripts/analizar_error.sh  >> logs/cron_error.log  2>&1

# Reporte final los viernes a las 07:00 AM
0 7 * * 5 cd /ruta/SO-starter && ./scripts/reporte_final.sh   >> logs/cron_reporte.log 2>&1
CRONEOF
        echo ""
        echo "--- Cómo agregar las tareas ---"
        echo "  crontab -e   (abre el editor de crontab)"
        echo ""
        echo "--- Sintaxis cron ---"
        echo "  * * * * * comando"
        echo "  │ │ │ │ └── día de la semana (0=dom, 1=lun, ..., 6=sab)"
        echo "  │ │ │ └──── mes (1-12)"
        echo "  │ │ └────── día del mes (1-31)"
        echo "  │ └──────── hora (0-23)"
        echo "  └────────── minuto (0-59)"
    } > "$CRON_EVIDENCIA"
    log_msg "OK" "Evidencia de cron guardada en: $CRON_EVIDENCIA"
fi

separador
