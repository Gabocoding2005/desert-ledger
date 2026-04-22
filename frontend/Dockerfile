FROM node:20

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Puerto de Vite
EXPOSE 5173

# Ejecutar en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host"]
