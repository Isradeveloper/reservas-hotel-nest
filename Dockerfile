# Usa la imagen oficial de Node.js 22
FROM node:22 AS build

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos de configuración de package.json y yarn.lock
COPY package.json yarn.lock ./

# Instala las dependencias utilizando Yarn
RUN yarn install --frozen-lockfile


# Copia todo el código del proyecto al contenedor
COPY . .

# Ejecuta npx prisma generate para generar el cliente Prisma
RUN npx prisma generate

# Compila el proyecto NestJS
RUN yarn build

# Usa una imagen más ligera para la etapa de producción
FROM node:22-slim

# Establece el directorio de trabajo en /app
WORKDIR /app

# Instala OpenSSL 1.1.x en la imagen final
RUN apt-get update -y && apt-get install -y openssl libssl1.1

# Copia las dependencias instaladas y el código compilado desde la etapa de build
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json

# Exponer el puerto en el que la aplicación estará corriendo
EXPOSE 3000

# Comando para ejecutar la aplicación en producción
CMD ["node", "dist/main"]
