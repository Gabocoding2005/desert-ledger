#!/usr/bin/env bash
# menu.sh — Menú interactivo para ejecutar todos los scripts del proyecto.
# Uso: ./scripts/menu.sh

source ./config.conf
source ./scripts/lib.sh

check_project_root

mostrar_menu() {
    clear
    separador
    echo "  PROYECTO FINAL SO — $EQUIPO"
    separador
    echo "  1) Ejecutar Setup (estructura + sitio_web)"
    echo "  2) Crear Backup"
    echo "  3) Rotar Backups"
    echo "  4) Analizar access.log"
    echo "  5) Analizar error.log"
    echo "  6) Generar Reporte Final"
    echo "  7) Ejecutar TODO el flujo (1→6)"
    echo "  8) Ver evidencias generadas"
    echo "  9) Ver backups disponibles"
    echo "  0) Salir"
    separador
    echo -n "  Opción: "
}

ver_evidencias() {
    titulo "EVIDENCIAS GENERADAS"
    echo ""
    echo "  Directorio: $EVIDENCIA_DIR"
    if [[ -d "$EVIDENCIA_DIR" ]]; then
        find "$EVIDENCIA_DIR" -type f | sort | while IFS= read -r f; do
            echo "  $(ls -lh "$f" | awk '{print $5, $9}')"
        done
    fi
    echo ""
    echo "  Directorio: $REPORTES_DIR"
    if [[ -d "$REPORTES_DIR" ]]; then
        find "$REPORTES_DIR" -type f | sort | while IFS= read -r f; do
            echo "  $(ls -lh "$f" | awk '{print $5, $9}')"
        done
    fi
    echo ""
    read -rp "  Presiona Enter para continuar..."
}

ver_backups() {
    titulo "BACKUPS DISPONIBLES"
    echo "  Directorio: $BACKUPS_DIR"
    echo ""
    if [[ -d "$BACKUPS_DIR" ]]; then
        TOTAL=$(find "$BACKUPS_DIR" -name "${BACKUP_PREFIX}_*.tar.gz" | wc -l)
        echo "  Total de backups: $TOTAL (máximo configurado: $MAX_BACKUPS)"
        echo ""
        find "$BACKUPS_DIR" -name "${BACKUP_PREFIX}_*.tar.gz" -printf "  %T+  %f  (%s bytes)\n" | sort
    fi
    echo ""
    read -rp "  Presiona Enter para continuar..."
}

while true; do
    mostrar_menu
    read -r opcion
    echo ""

    case "$opcion" in
        1)
            log_msg "INFO" "Ejecutando setup.sh ..."
            bash ./scripts/setup.sh
            read -rp "  Presiona Enter para continuar..."
            ;;
        2)
            log_msg "INFO" "Ejecutando backup.sh ..."
            bash ./scripts/backup.sh
            read -rp "  Presiona Enter para continuar..."
            ;;
        3)
            log_msg "INFO" "Ejecutando rotar_backups.sh ..."
            bash ./scripts/rotar_backups.sh
            read -rp "  Presiona Enter para continuar..."
            ;;
        4)
            log_msg "INFO" "Ejecutando analizar_access.sh ..."
            bash ./scripts/analizar_access.sh
            read -rp "  Presiona Enter para continuar..."
            ;;
        5)
            log_msg "INFO" "Ejecutando analizar_error.sh ..."
            bash ./scripts/analizar_error.sh
            read -rp "  Presiona Enter para continuar..."
            ;;
        6)
            log_msg "INFO" "Ejecutando reporte_final.sh ..."
            bash ./scripts/reporte_final.sh
            read -rp "  Presiona Enter para continuar..."
            ;;
        7)
            titulo "EJECUCIÓN COMPLETA DEL FLUJO"
            for script in setup.sh backup.sh rotar_backups.sh \
                          analizar_access.sh analizar_error.sh reporte_final.sh; do
                log_msg "INFO" "--- Ejecutando $script ---"
                bash "./scripts/$script"
                echo ""
            done
            log_msg "OK" "Flujo completo finalizado."
            read -rp "  Presiona Enter para continuar..."
            ;;
        8) ver_evidencias ;;
        9) ver_backups ;;
        0)
            log_msg "INFO" "Saliendo. ¡Hasta luego, equipo $EQUIPO!"
            exit 0
            ;;
        *)
            log_msg "WARN" "Opción inválida: '$opcion'. Elige entre 0 y 9."
            sleep 1
            ;;
    esac
done
