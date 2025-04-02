# Etapa de instalación de dependencias (solo cuando sea necesario)
FROM node:20.15-alpine3.20 AS deps

# Instalar la librería de compatibilidad para Alpine
RUN apk add --no-cache libc6-compat

# Establecer el directorio de trabajo en la imagen
WORKDIR /app

# Copiar los archivos de configuración de las dependencias (package.json y yarn.lock)
COPY package.json yarn.lock ./

# Instalar las dependencias del proyecto de acuerdo al archivo yarn.lock
# Esto ejecutará el gancho postinstall de Prisma, generando el cliente automáticamente
RUN yarn install --frozen-lockfile

# Etapa de construcción de la aplicación, usando las dependencias de la etapa anterior
FROM node:20.15-alpine3.20 AS builder

# Establecer el directorio de trabajo en la imagen
WORKDIR /app

# Copiar las dependencias instaladas desde la etapa 'deps'
COPY --from=deps /app/node_modules ./node_modules

# Copiar todo el código fuente al contenedor
COPY . .

RUN npx prisma generate
# Construir la aplicación
RUN yarn build

# Etapa de producción, copiar todos los archivos necesarios y ejecutar la aplicación
FROM node:20.15-alpine3.20 AS runner

# Establecer el directorio de trabajo para la aplicación en producción
WORKDIR /usr/src/app

# Copiar los archivos de configuración de las dependencias para producción
COPY package.json yarn.lock ./

# Instalar solo las dependencias necesarias para producción
# Esto también activará el gancho postinstall de Prisma en producción
RUN yarn install --prod

# Copiar el directorio de distribución desde la etapa 'builder' (donde se construyó la app)
COPY --from=builder /app/dist ./dist

# Ejecutar la aplicación al iniciar el contenedor
CMD ["node", "dist/main"]
