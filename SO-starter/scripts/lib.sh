#!/usr/bin/env bash
# lib.sh — Funciones compartidas para todos los scripts del proyecto.
# Fuente: source ./scripts/lib.sh  (ejecutar desde raíz del proyecto)

# ── Colores ─────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ── log_msg NIVEL MENSAJE ────────────────────────────────────────────────────
log_msg() {
    local nivel="$1"
    local msg="$2"
    local ts
    ts=$(date "+%Y-%m-%d %H:%M:%S")
    case "$nivel" in
        OK)    echo -e "${GREEN}[$ts] [OK]   ${NC}$msg" ;;
        INFO)  echo -e "${BLUE}[$ts] [INFO] ${NC}$msg" ;;
        WARN)  echo -e "${YELLOW}[$ts] [WARN] ${NC}$msg" ;;
        ERROR) echo -e "${RED}[$ts] [ERROR]${NC}$msg" ;;
        *)     echo "[$ts] [$nivel] $msg" ;;
    esac
}

# ── check_dir DIR ────────────────────────────────────────────────────────────
# Crea el directorio si no existe.
check_dir() {
    local dir="$1"
    if [[ ! -d "$dir" ]]; then
        mkdir -p "$dir"
        log_msg "INFO" "Directorio creado: $dir"
    fi
}

# ── check_file ARCHIVO ───────────────────────────────────────────────────────
# Aborta el script si el archivo no existe.
check_file() {
    local f="$1"
    if [[ ! -f "$f" ]]; then
        log_msg "ERROR" "Archivo no encontrado: $f"
        exit 1
    fi
}

# ── check_project_root ───────────────────────────────────────────────────────
# Verifica que el script se ejecuta desde la raíz del proyecto.
check_project_root() {
    if [[ ! -f "config.conf" ]]; then
        echo -e "${RED}ERROR:${NC} Ejecuta los scripts desde la raíz del proyecto."
        echo "       Ejemplo: ./scripts/backup.sh"
        exit 1
    fi
}

# ── separador ────────────────────────────────────────────────────────────────
separador() {
    echo "════════════════════════════════════════════════════"
}

# ── titulo TEXTO ─────────────────────────────────────────────────────────────
titulo() {
    echo ""
    separador
    echo -e "  ${BOLD}$1${NC}"
    separador
}

# ── bytes_a_human BYTES ──────────────────────────────────────────────────────
bytes_a_human() {
    local bytes=$1
    if   (( bytes >= 1073741824 )); then printf "%.2f GB\n" "$(echo "scale=2; $bytes/1073741824" | bc)"
    elif (( bytes >= 1048576    )); then printf "%.2f MB\n" "$(echo "scale=2; $bytes/1048576"    | bc)"
    elif (( bytes >= 1024       )); then printf "%.2f KB\n" "$(echo "scale=2; $bytes/1024"       | bc)"
    else echo "${bytes} B"
    fi
}
