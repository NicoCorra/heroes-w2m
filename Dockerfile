# Paso 1: Usar una imagen base con Node.js
FROM node:18 as build

# Paso 2: Establecer el directorio de trabajo
WORKDIR /app

# Paso 3: Copiar el archivo package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Paso 4: Instalar dependencias
RUN npm install

# Paso 5: Copiar todos los archivos del proyecto al contenedor
COPY . .

# Paso 6: Construir la aplicación Angular para producción
RUN npm run build --prod

# Paso 7: Usar una imagen ligera de Nginx para servir la aplicación
FROM nginx:alpine

# Paso 8: Copiar los archivos generados por el build al directorio de Nginx
COPY --from=build /app/dist/heroes /usr/share/nginx/html

# Paso 9: Exponer el puerto 80 para que la aplicación sea accesible
EXPOSE 80

# Paso 10: Iniciar Nginx para servir la aplicación
CMD ["nginx", "-g", "daemon off;"]
