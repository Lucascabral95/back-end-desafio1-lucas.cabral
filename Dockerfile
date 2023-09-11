# FROM node 

# WORKDIR /app 

# COPY package*.json ./

# RUN npm install -g nodemon

# COPY . . 

# EXPOSE 8080

# # CMD ["npm","run","dev"]
# CMD ["npm","start"]



# Utiliza una imagen base de Node.js con la versión que necesitas
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de npm
COPY package*.json ./

# Instala las dependencias locales
RUN npm install -g nodemon

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación cuando se inicie el contenedor
CMD ["npm", "start"]
