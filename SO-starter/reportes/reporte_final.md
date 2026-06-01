# Reporte Final — Proyecto SO: Automatización y Análisis de Logs

**Equipo:** COBRA_REAL
**Integrantes:** (completar en ALUMNOS.md)
**Fecha de generación:** 01/06/2026 05:48:48

---

## 1. Resumen Ejecutivo

Este reporte consolida el análisis del sistema de respaldos y monitoreo del servidor web
de la empresa. Se analizaron los archivos `access.log` y `error.log` generados durante
el mes de **mayo de 2025**.

| Indicador | Valor |
|---|---|
| Total de peticiones HTTP | 323 |
| Total de líneas en error.log | 74 |
| Respaldos en disco | 3 |
| IP más activa | 185.220.101.34 (92 peticiones) |
| URL más solicitada | / |
| Código HTTP más frecuente | 200 |
| Errores 404 | 45 |
| Errores 5xx | 6 |
| Errores de base de datos | 6 |
| Accesos denegados (403) | 35 |

---

## 2. Análisis de Tráfico (access.log)

### 2.1 Distribución de Códigos HTTP

```
200      224 peticiones
404       45 peticiones
403       37 peticiones
500        6 peticiones
304        5 peticiones
302        4 peticiones
301        2 peticiones
```

### 2.2 Métodos HTTP Utilizados

```
GET        289 peticiones
POST        34 peticiones
```

### 2.3 Top 10 IPs más Activas

```
185.220.101.34        92 peticiones
192.168.1.10          57 peticiones
45.33.32.156          54 peticiones
192.168.1.15          35 peticiones
203.0.113.50          25 peticiones
198.51.100.25         19 peticiones
10.0.0.5              19 peticiones
66.249.73.125         13 peticiones
40.77.167.140          9 peticiones
```

### 2.4 Top 10 URLs más Solicitadas

```
  82  /
  30  /login
  23  /servicios.html
  20  /productos.html
  19  /status
  19  /precios.html
  14  /nosotros.html
  14  /contacto.html
   8  /blog/index.html
   7  /blog/entrada-1.html
```

### 2.5 Distribución por Hora del Día

```
Hora 02:xx    85 peticiones
Hora 03:xx    30 peticiones
Hora 04:xx    31 peticiones
Hora 06:xx     5 peticiones
Hora 07:xx     4 peticiones
Hora 08:xx    29 peticiones
Hora 09:xx    45 peticiones
Hora 10:xx    25 peticiones
Hora 11:xx    19 peticiones
Hora 12:xx     3 peticiones
Hora 13:xx     7 peticiones
Hora 14:xx    19 peticiones
Hora 15:xx    11 peticiones
Hora 16:xx     7 peticiones
Hora 18:xx     3 peticiones
```

---

## 3. Detección de Actividad Sospechosa

### 3.1 IPs con Alto Volumen (umbral: > 90 peticiones)

```
[ALERTA] 185.220.101.34        92 peticiones
```

> **Acción recomendada:** Revisar y bloquear a nivel de firewall.

### 3.2 IPs con Muchos 404 — Posibles Escáneres (umbral: > 40)

```
[ESCANER] 45.33.32.156          41 errores 404
```

> **Acción recomendada:** Bloquear IP en firewall, revisar reglas de WAF.

### 3.3 Rutas Sensibles Accedidas

```
12 intentos de acceso a rutas sensibles detectados.
   1  45.33.32.156        /wp-admin/
   1  45.33.32.156        /shell.php
   1  45.33.32.156        /phpmyadmin/index.php
   1  45.33.32.156        /phpmyadmin/
   1  45.33.32.156        /etc/passwd
   1  45.33.32.156        /dump.sql
   1  45.33.32.156        /db.sql
   1  45.33.32.156        /database.sql
   1  45.33.32.156        /backup.sql
   1  45.33.32.156        /?id=1+UNION+SELECT+1%2C2%2C3
```

---

## 4. Análisis de Errores del Servidor (error.log)

### 4.1 Errores por Severidad

```
crit         1 líneas
error       52 líneas
warn        10 líneas
notice      11 líneas
```

### 4.2 Errores Críticos (PHP Fatal / DB / crit)

```
10:31:45.654321 2025] [core:error] [pid 12302] [client 192.168.1.15:54421] AH01276: Cannot serve directory /var/www/html/uploads/: No index, add 'Options +Indexes' or add a directory index 
14:10:15.789012 2025] [authz_core:error] [pid 12305] [client 66.249.73.125:55001] AH01630: client denied by server configuration: /var/www/html/blog/entrada-3.html 
09:15:33.222333 2025] [php:error] [pid 12310] [client 192.168.1.15:54600] PHP Fatal error: Uncaught PDOException: SQLSTATE[HY000] [2002] Connection refused in /var/www/html/lib/database.php:45 
09:15:34.333444 2025] [php:error] [pid 12311] [client 192.168.1.15:54601] PHP Fatal error: Uncaught PDOException: SQLSTATE[HY000] [2002] Connection refused in /var/www/html/lib/database.php:45 
06:30:50.111222 2025] [core:error] [pid 12320] [client 40.77.167.140:56001] AH01630: client denied by server configuration: /var/www/html/.git/config 
14:22:33.444555 2025] [php:error] [pid 12350] [client 192.168.1.15:54900] PHP Fatal error: Allowed memory size of 134217728 bytes exhausted (tried to allocate 20480 bytes) in /var/www/html/admin/reportes.php on line 156 
14:22:33.555666 2025] [core:error] [pid 12350] [client 192.168.1.15:54900] End of script output before headers: reportes.php 
09:11:30.234567 2025] [authz_core:error] [pid 12370] [client 192.168.1.10:55200] AH01630: client denied by server configuration: /var/www/html/dashboard 
09:20:15.345678 2025] [authz_core:error] [pid 12371] [client 192.168.1.10:55201] AH01630: client denied by server configuration: /var/www/html/admin/reportes 
02:14:56.567890 2025] [authz_core:error] [pid 12390] [client 45.33.32.156:56100] AH01630: client denied by server configuration: /var/www/html/.env 
```

### 4.3 Errores de Base de Datos

```
6 errores de BD detectados.
[Sat May 03 09:15:33.222333 2025] [php:error] [pid 12310] [client 192.168.1.15:54600] PHP Fatal error: Uncaught PDOException: SQLSTATE[HY000] [2002] Connection refused in /var/www/html/lib/database.php:45
[Sat May 03 09:15:34.333444 2025] [php:error] [pid 12311] [client 192.168.1.15:54601] PHP Fatal error: Uncaught PDOException: SQLSTATE[HY000] [2002] Connection refused in /var/www/html/lib/database.php:45
[Sun May 18 10:00:01.678901 2025] [php:error] [pid 12470] [client 10.0.0.5:58001] PHP Fatal error: Uncaught PDOException: SQLSTATE[HY000] [2002] Connection refused in /var/www/html/lib/database.php:45
[Sun May 25 11:02:00.777888 2025] [php:error] [pid 12530] [client 203.0.113.50:55900] PHP Fatal error: Uncaught Exception: Database query failed: SQLSTATE[42S02]: Base table or view not found: 1146 Table 'empresa.articulos' doesn't exist in /var/www/html/blog/entrada.php:67
[Thu May 29 09:05:00.100200 2025] [php:error] [pid 12560] [client 192.168.1.15:56100] PHP Fatal error: Uncaught PDOException: SQLSTATE[HY000] [2002] Connection refused in /var/www/html/lib/database.php:45
```

### 4.4 Intentos de Intrusión Registrados en error.log

```
37 entradas de seguridad.
```

---

## 5. Estado del Sistema de Respaldos

| Elemento | Valor |
|---|---|
| Directorio de backups | `backups/` |
| Backups conservados | 3 |
| Máximo configurado (MAX_BACKUPS) | 3 |
| Espacio en uso | 16K |

- `backup_sitio_20260601_054704.tar.gz` — 4.0K
- `backup_sitio_20260601_054705.tar.gz` — 4.0K
- `backup_sitio_20260601_054706.tar.gz` — 4.0K

---

## 6. Configuración de Cron

```
# Tareas programadas recomendadas:
# Respaldo diario a las 02:00 AM
0 2 * * * cd /home/user/desert-ledger/SO-starter && ./scripts/backup.sh >> logs/cron_backup.log 2>&1

# Rotación de backups: lunes a las 02:30 AM
30 2 * * 1 cd /home/user/desert-ledger/SO-starter && ./scripts/rotar_backups.sh >> logs/cron_rotar.log 2>&1

# Análisis diario de logs a las 06:00 AM
0 6 * * * cd /home/user/desert-ledger/SO-starter && ./scripts/analizar_access.sh >> logs/cron_access.log 2>&1
0 6 * * * cd /home/user/desert-ledger/SO-starter && ./scripts/analizar_error.sh  >> logs/cron_error.log  2>&1

# Reporte final los viernes a las 07:00 AM
0 7 * * 5 cd /home/user/desert-ledger/SO-starter && ./scripts/reporte_final.sh   >> logs/cron_reporte.log 2>&1
```

---

## 7. Conclusiones y Recomendaciones

### Hallazgos Principales

1. **Escáner de vulnerabilidades detectado:** La IP `45.33.32.156` generó 41 errores 404
   en un lapso muy corto, intentando acceder a rutas como `/wp-admin`, `/.env`, `/.git/config`,
   y ejecutando consultas SQL maliciosas. **Acción: Bloquear en firewall.**

2. **Ataque de fuerza bruta al login:** La IP `185.220.101.34` realizó más de 92
   peticiones automatizadas, incluyendo múltiples intentos POST a `/login`.
   **Acción: Implementar rate limiting y autenticación de dos factores.**

3. **Errores de base de datos:** Se detectaron 6 errores de conexión a la base de datos,
   indicando inestabilidad en el servicio MySQL/MariaDB. **Acción: Revisar configuración de pool
   de conexiones y monitorear el servicio de base de datos.**

4. **Consumo de memoria PHP:** Se detectaron errores de memoria agotada en scripts de reportes
   y estadísticas. **Acción: Aumentar `memory_limit` en php.ini o paginar las consultas.**

5. **Respaldos:** El sistema de respaldos funciona correctamente. Se mantienen 3
   copias de seguridad rotadas automáticamente.

### Recomendaciones de Seguridad

- [ ] Bloquear las IPs `45.33.32.156` y `185.220.101.34` a nivel de firewall (iptables/ufw).
- [ ] Implementar fail2ban para banear automáticamente IPs con muchos 404.
- [ ] Agregar autenticación en rutas administrativas con `mod_auth`.
- [ ] Mover archivos sensibles (`.env`, `.git`) fuera del DocumentRoot.
- [ ] Habilitar HTTPS en todas las rutas.
- [ ] Programar respaldos automáticos via cron.
- [ ] Configurar alertas de monitoreo para errores de base de datos.

---

## 8. Evidencias Generadas

| Archivo | Descripción |
|---|---|
| `evidencia/setup_estructura.txt` | Estructura del proyecto y entorno |
| `evidencia/backup_ejecucion.txt` | Ejecución y resultado del backup |
| `evidencia/rotacion.txt` | Rotación de backups |
| `evidencia/cron.txt` | Configuración de tareas cron |
| `reportes/reporte_access.txt` | Análisis detallado de access.log |
| `reportes/reporte_error.txt` | Análisis detallado de error.log |
| `reportes/reporte_final.md` | Este reporte consolidado |

---

*Generado automáticamente por `scripts/reporte_final.sh` — Proyecto Final SO*
