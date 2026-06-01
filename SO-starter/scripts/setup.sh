#!/usr/bin/env bash
# setup.sh — Inicializa la estructura del proyecto y genera evidencia de entorno.
# Uso: ./scripts/setup.sh

source ./config.conf
source ./scripts/lib.sh

check_project_root

titulo "SETUP — Inicialización del Proyecto Final SO"
echo "  Equipo : $EQUIPO"
echo "  Fecha  : $(date)"
echo ""

# ── 1. Crear directorios necesarios ─────────────────────────────────────────
log_msg "INFO" "Creando estructura de directorios..."
for dir in "$SITIO_WEB" "$DATOS_EMPRESA" "$BACKUPS_DIR" "$EVIDENCIA_DIR" "$REPORTES_DIR"; do
    check_dir "$dir"
done

# ── 2. Poblar sitio_web con archivos de ejemplo si está vacío ────────────────
if [[ -z "$(ls -A "$SITIO_WEB" 2>/dev/null)" ]]; then
    log_msg "INFO" "Generando archivos de ejemplo en $SITIO_WEB ..."
    mkdir -p "$SITIO_WEB/css" "$SITIO_WEB/js" "$SITIO_WEB/img" "$SITIO_WEB/blog"

    cat > "$SITIO_WEB/index.html" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Empresa S.A.</title><link rel="stylesheet" href="css/style.css"></head>
<body>
  <h1>Bienvenido a Empresa S.A.</h1>
  <nav>
    <a href="nosotros.html">Nosotros</a> |
    <a href="servicios.html">Servicios</a> |
    <a href="productos.html">Productos</a> |
    <a href="precios.html">Precios</a> |
    <a href="contacto.html">Contacto</a>
  </nav>
  <script src="js/app.js"></script>
</body>
</html>
HTMLEOF

    for page in nosotros servicios productos precios contacto gracias; do
        echo "<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'><title>${page^}</title></head><body><h1>${page^}</h1></body></html>" \
            > "$SITIO_WEB/${page}.html"
    done

    cat > "$SITIO_WEB/css/style.css" << 'CSSEOF'
body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
h1   { color: #333; }
nav  { margin-bottom: 20px; }
nav a { margin-right: 10px; text-decoration: none; color: #0066cc; }
CSSEOF

    echo "console.log('Empresa S.A. — app cargada');" > "$SITIO_WEB/js/app.js"
    echo "User-agent: *" > "$SITIO_WEB/robots.txt"
    touch "$SITIO_WEB/img/.gitkeep"

    mkdir -p "$SITIO_WEB/blog"
    for i in 1 2; do
        echo "<!DOCTYPE html><html><body><h1>Entrada $i</h1><p>Contenido del artículo $i.</p></body></html>" \
            > "$SITIO_WEB/blog/entrada-${i}.html"
    done
    echo "<!DOCTYPE html><html><body><h1>Blog</h1></body></html>" > "$SITIO_WEB/blog/index.html"

    log_msg "OK" "sitio_web creado con $(find "$SITIO_WEB" -type f | wc -l) archivos."
fi

# ── 3. Poblar datos_empresa con archivos de ejemplo si está vacío ────────────
if [[ -z "$(ls -A "$DATOS_EMPRESA" 2>/dev/null)" ]]; then
    log_msg "INFO" "Generando datos de ejemplo en $DATOS_EMPRESA ..."
    cat > "$DATOS_EMPRESA/empleados.csv" << 'CSVEOF'
ID,Nombre,Departamento,Puesto,Salario
1,Juan García,Tecnología,Desarrollador Senior,55000
2,María López,Recursos Humanos,Coordinadora,42000
3,Carlos Ruiz,Ventas,Ejecutivo,40000
4,Ana Martínez,Contabilidad,Contadora,45000
5,Luis Hernández,Tecnología,Administrador de Sistemas,50000
6,Sofía Torres,Marketing,Diseñadora,38000
7,Pedro Ramírez,Ventas,Gerente,62000
8,Elena Castro,Tecnología,QA Engineer,43000
CSVEOF

    cat > "$DATOS_EMPRESA/clientes.csv" << 'CSVEOF'
ID,Empresa,Contacto,Email,Ciudad
1,Corporativo ABC,Roberto Soto,rsoto@abc.com,Ciudad de México
2,Industrias XYZ,Carmen Vega,cvega@xyz.com,Guadalajara
3,Distribuidora DEF,Miguel Ángel Ríos,mrios@def.com,Monterrey
4,Servicios GHI,Patricia Morales,pmorales@ghi.com,Puebla
CSVEOF

    log_msg "OK" "datos_empresa creado."
fi

# ── 4. Generar evidencia ─────────────────────────────────────────────────────
EVIDENCIA_FILE="$EVIDENCIA_DIR/setup_estructura.txt"
log_msg "INFO" "Generando evidencia en $EVIDENCIA_FILE ..."

{
    echo "======================================================"
    echo "  EVIDENCIA DE SETUP — Proyecto Final SO"
    echo "======================================================"
    echo "Equipo   : $EQUIPO"
    echo "Fecha    : $(date)"
    echo "Usuario  : $(whoami)"
    echo "Hostname : $(hostname)"
    echo ""
    echo "--- Sistema Operativo ---"
    uname -a
    echo ""
    echo "--- Directorio de trabajo ---"
    pwd
    echo ""
    echo "--- Estructura del proyecto ---"
    find . -not -path './.git/*' -not -name '.gitkeep' | sort | head -80
    echo ""
    echo "--- Permisos de scripts ---"
    ls -la scripts/
    echo ""
    echo "--- Variables de configuración activas ---"
    echo "SITIO_WEB    = $SITIO_WEB"
    echo "DATOS_EMPRESA= $DATOS_EMPRESA"
    echo "BACKUPS_DIR  = $BACKUPS_DIR"
    echo "LOGS_DIR     = $LOGS_DIR"
    echo "EVIDENCIA_DIR= $EVIDENCIA_DIR"
    echo "REPORTES_DIR = $REPORTES_DIR"
    echo "MAX_BACKUPS  = $MAX_BACKUPS"
    echo "ACCESS_LOG   = $ACCESS_LOG"
    echo "ERROR_LOG    = $ERROR_LOG"
    echo ""
    echo "--- Archivos en sitio_web ---"
    find "$SITIO_WEB" -type f | sort
    echo ""
    echo "--- Logs disponibles ---"
    ls -lh "$LOGS_DIR/"
    echo ""
    echo "--- Espacio en disco ---"
    df -h .
} | tee "$EVIDENCIA_FILE"

log_msg "OK" "Setup completado. Evidencia guardada en: $EVIDENCIA_FILE"
separador
