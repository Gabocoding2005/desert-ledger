FROM python:3.12

WORKDIR /app

# Copiar requirements primero para aprovechar el cache
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código
COPY . .

# Dar permisos de ejecución al script de entrada
RUN chmod +x entrypoint.sh

# Puerto que expone Flask
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["./entrypoint.sh"]
