# Backend - Reservas Hotel

Este proyecto consiste en la construcción de un API GraphQL para la reserva de habitaciones en un hotel, implementado con el framework NestJS. El sistema permite gestionar las reservas de un hotel de 30 habitaciones, donde los usuarios pueden realizar reservas según la disponibilidad, tipo de habitación, número de personas, fechas de entrada y salida, y opción de servicio todo incluido. Además, se implementan reglas dinámicas de cálculo de precios y descuentos basadas en el número de noches, los días de la semana y las características de la habitación.

## 🚀 Pasos para ejecutar el proyecto

### 1️⃣ Llenar las variables de entorno

Antes de ejecutar el proyecto, copia el archivo de .env.template y modifica los valores según tu configuración.

---

### 2️⃣ Instalar dependencias

Asegúrate de tener **Yarn** instalado y ejecuta:

```sh
yarn install
```

---

### 3️⃣ Levantar los servicios con Docker Compose-dev

Para ejecutar el backend junto con Redis, usa el siguiente comando:

```sh
docker compose -f docker-compose.dev.yaml up -d

```

Esto iniciará el backend y la base de datos PostgreSQL local

---

### 4️⃣ Ejecutar migraciones de prisma y generar cliente

```sh
npx prisma migrate deploy
```

```sh
npx prisma generate
```

---

Esto creara las tablas de la base de datos

### 5️⃣ Iniciar el servidor en modo desarrollo

Una vez que los contenedores estén corriendo, puedes iniciar el servidor en modo desarrollo con:

```sh
yarn start:dev
```

---

### 6️⃣ Acceder al GraphQL

Una vez que el servidor esté corriendo, puedes acceder al GraphQL Playground en:

```sh
http://localhost:${PORT}/graphql
```

### 7️⃣ Ejecutar seed

Esto llenara las tablas de la base de datos

mutation Mutation {
executeSeed
}

## 🛠 Tecnologías usadas

- NestJS: Framework de Node.js para construir aplicaciones eficientes, confiables y escalables. Utilizado para crear el API GraphQL, gestionando las operaciones de reserva, cálculo de precios y generación de respuestas optimizadas.

- GraphQL: Lenguaje de consulta para API que permite obtener exactamente los datos requeridos. Implementado para gestionar las consultas (queries) y mutaciones del sistema de reservas de habitaciones.

- TypeScript: Lenguaje de programación que añade tipado estático a JavaScript, utilizado en el desarrollo de la API para mejorar la mantenibilidad y la detección temprana de errores.

- PostgreSQL: Sistema de gestión de bases de datos relacional utilizado para almacenar los datos de las habitaciones, reservas, y detalles asociados, asegurando consultas rápidas y eficientes.

- Prisma: ORM utilizado para interactuar con la base de datos PostgreSQL, permitiendo una integración sencilla con NestJS y una gestión eficiente de las operaciones CRUD.

- Jest: Framework de pruebas utilizado para asegurar la calidad del código mediante la ejecución de pruebas unitarias y de integración, garantizando que las funcionalidades del sistema funcionen correctamente.

---

# Documentación de la API

Este documento describe la API GraphQL para la gestión de habitaciones y reservas.

## Scalars

### `Date`

Un tipo escalar personalizado que representa una fecha y hora en Timezone America Bogotá. El formato esperado es `yyyy-MM-dd HH:mm`.

## Tipos

### `AvailableRoom`

Representa una habitación que está disponible para reserva durante un período de tiempo específico.

| Campo            | Tipo             | Descripción                         |
| ---------------- | ---------------- | ----------------------------------- |
| `id`             | `ID!`            | ID de la habitación                 |
| `number`         | `Int!`           | Número de la habitación             |
| `isActive`       | `Boolean!`       | Indica si la habitación está activa |
| `createdAt`      | `Date!`          | Fecha de creación                   |
| `updatedAt`      | `Date!`          | Fecha de última actualización       |
| `billingDetails` | `BillingDetails` | Detalles de facturación             |
| `type`           | `RoomType!`      | Tipo de habitación                  |
| `view`           | `RoomView!`      | Vista desde la habitación           |

### `AvailableRoomCount`

Representa un conteo de habitaciones disponibles y una lista de esas habitaciones.

| Campo   | Tipo                | Descripción                        |
| ------- | ------------------- | ---------------------------------- |
| `count` | `Int!`              | Número de habitaciones disponibles |
| `rooms` | `[AvailableRoom!]!` | Lista de habitaciones disponibles  |

### `BillingDetails`

Proporciona un desglose de la facturación para la reserva de una habitación.

| Campo               | Tipo     | Descripción                                 |
| ------------------- | -------- | ------------------------------------------- |
| `days`              | `Int!`   | Número total de días                        |
| `nights`            | `Int!`   | Número total de noches                      |
| `basePrice`         | `Float!` | Precio base de la estancia                  |
| `weekendDays`       | `Int!`   | Número de días de fin de semana             |
| `weekendIncrease`   | `Float!` | Cargo adicional por fines de semana         |
| `daysDiscount`      | `Float!` | Descuento aplicado por estancias más largas |
| `allInclusiveTotal` | `Float!` | Costo total de la opción todo incluido      |
| `total`             | `Float!` | Costo total de la reserva                   |

### `Reservation`

Representa una reserva de habitación.

| Campo          | Tipo             | Descripción          |
| -------------- | ---------------- | -------------------- |
| `id`           | `ID!`            | ID                   |
| `checkIn`      | `Date!`          | Fecha de Check In    |
| `checkOut`     | `Date!`          | Fecha de Check Out   |
| `peopleNumber` | `Int!`           | Número de personas   |
| `allInclusive` | `Boolean!`       | Opción Todo Incluido |
| `total`        | `Float!`         | Costo total          |
| `roomId`       | `String!`        | ID de la habitación  |
| `room`         | `AvailableRoom!` | Habitación reservada |

### `ReservationGroup`

Organiza las reservas en diferentes grupos de estado.

| Campo        | Tipo                    | Descripción         |
| ------------ | ----------------------- | ------------------- |
| `pending`    | `ReservationGroupItem!` | Reservas pendientes |
| `inProgress` | `ReservationGroupItem!` | Reservas en curso   |
| `past`       | `ReservationGroupItem!` | Reservas pasadas    |

### `ReservationGroupItem`

Representa un grupo de reservas con un conteo.

| Campo          | Tipo              | Descripción        |
| -------------- | ----------------- | ------------------ |
| `count`        | `Int!`            | Número de reservas |
| `reservations` | `[Reservation!]!` | Lista de reservas  |

### `Room`

Representa una habitación específica en el hotel.

| Campo       | Tipo        | Descripción                         |
| ----------- | ----------- | ----------------------------------- |
| `id`        | `ID!`       | ID de la habitación                 |
| `number`    | `Int!`      | Número de la habitación             |
| `isActive`  | `Boolean!`  | Indica si la habitación está activa |
| `createdAt` | `Date!`     | Fecha de creación                   |
| `updatedAt` | `Date!`     | Fecha de última actualización       |
| `type`      | `RoomType!` | Tipo de habitación                  |
| `view`      | `RoomView!` | Vista desde la habitación           |

### `RoomType`

Representa un tipo de habitación con características específicas.

| Campo         | Tipo       | Descripción      |
| ------------- | ---------- | ---------------- |
| `id`          | `ID!`      | ID               |
| `name`        | `String!`  | Nombre           |
| `basePrice`   | `Float!`   | Precio Base      |
| `maxCapacity` | `Int!`     | Capacidad Máxima |
| `isActive`    | `Boolean!` | Está Activo      |
| `createdAt`   | `Date!`    | Creado En        |
| `updatedAt`   | `Date!`    | Actualizado En   |

### `RoomView`

Representa la vista desde una habitación.

| Campo       | Tipo       | Descripción                               |
| ----------- | ---------- | ----------------------------------------- |
| `id`        | `ID!`      | ID de la vista de la habitación           |
| `name`      | `String!`  | Nombre de la vista de la habitación       |
| `createdAt` | `Date!`    | Fecha de creación de la vista             |
| `updatedAt` | `Date!`    | Fecha de última actualización de la vista |
| `isActive`  | `Boolean!` | Indica si la vista está activa            |

## Consultas

### `availableRooms(checkIn: String!, checkOut: String!, peopleNumber: Int!, roomTypeId: ID, roomViewId: ID, allInclusive: Boolean = false, isExterior: Boolean, search: String): AvailableRoomCount!`

Recupera una lista de habitaciones disponibles según los criterios proporcionados.

#### Argumentos

| Nombre         | Tipo      | Descripción                                                                 |
| -------------- | --------- | --------------------------------------------------------------------------- |
| `checkIn`      | `String!` | Fecha y hora de Check In (yyyy-MM-dd HH:mm)                                 |
| `checkOut`     | `String!` | Fecha y hora de Check Out (yyyy-MM-dd HH:mm)                                |
| `peopleNumber` | `Int!`    | Número de personas para la reserva                                          |
| `roomTypeId`   | `ID`      | ID opcional del tipo de habitación deseado                                  |
| `roomViewId`   | `ID`      | ID opcional de la vista de habitación deseada                               |
| `allInclusive` | `Boolean` | Filtro opcional para disponibilidad todo incluido (predeterminado: `false`) |
| `isExterior`   | `Boolean` | Filtro opcional para habitaciones exteriores                                |
| `search`       | `String`  | Término de búsqueda opcional                                                |

#### Devuelve

`AvailableRoomCount!`

### `reservation(id: ID!): Reservation!`

Recupera una reserva específica por su ID.

#### Argumentos

| Nombre | Tipo  | Descripción      |
| ------ | ----- | ---------------- |
| `id`   | `ID!` | ID de la reserva |

#### Devuelve

`Reservation!`

### `reservations: [Reservation!]!`

Recupera una lista de todas las reservas.

#### Devuelve

`[Reservation!]!`

### `reservationsGroup: ReservationGroup!`

Recupera las reservas agrupadas por su estado actual (pendientes, en curso, pasadas).

#### Devuelve

`ReservationGroup!`

### `room(id: ID!): Room!`

Recupera una habitación específica por su ID.

#### Argumentos

| Nombre | Tipo  | Descripción         |
| ------ | ----- | ------------------- |
| `id`   | `ID!` | ID de la habitación |

#### Devuelve

`Room!`

### `rooms: [Room!]!`

Recupera una lista de todas las habitaciones.

#### Devuelve

`[Room!]!`

### `roomType(id: ID!): RoomType!`

Recupera un tipo de habitación específico por su ID.

#### Argumentos

| Nombre | Tipo  | Descripción               |
| ------ | ----- | ------------------------- |
| `id`   | `ID!` | ID del tipo de habitación |

#### Devuelve

`RoomType!`

### `roomTypes: [RoomType!]!`

Recupera una lista de todos los tipos de habitación.

#### Devuelve

`[RoomType!]!`

### `roomView(id: ID!): RoomView!`

Recupera una vista de habitación específica por su ID.

#### Argumentos

| Nombre | Tipo  | Descripción                     |
| ------ | ----- | ------------------------------- |
| `id`   | `ID!` | ID de la vista de la habitación |

#### Devuelve

`RoomView!`

### `roomViews: [RoomView!]!`

Recupera una lista de todas las vistas de habitación.

#### Devuelve

`[RoomView!]!`

## Mutaciones

### `cancelReservation(id: ID!): Reservation!`

Cancela una reserva existente.

#### Argumentos

| Nombre | Tipo  | Descripción                 |
| ------ | ----- | --------------------------- |
| `id`   | `ID!` | ID de la reserva a cancelar |

#### Devuelve

`Reservation!`

### `createReservation(createReservationInput: CreateReservationInput!): Reservation!`

Crea una nueva reserva.

#### Argumentos

| Nombre                   | Tipo                      | Descripción                                     |
| ------------------------ | ------------------------- | ----------------------------------------------- |
| `createReservationInput` | `CreateReservationInput!` | Objeto de entrada para crear una nueva reserva. |

#### Devuelve

`Reservation!`

### `createRoom(createRoomInput: CreateRoomInput!): Room!`

Crea una nueva habitación.

#### Argumentos

| Nombre            | Tipo               | Descripción                                        |
| ----------------- | ------------------ | -------------------------------------------------- |
| `createRoomInput` | `CreateRoomInput!` | Objeto de entrada para crear una nueva habitación. |

#### Devuelve

`Room!`

### `createRoomType(createRoomTypeInput: CreateRoomTypeInput!): RoomType!`

Crea un nuevo tipo de habitación.

#### Argumentos

| Nombre                | Tipo                   | Descripción                                               |
| --------------------- | ---------------------- | --------------------------------------------------------- |
| `createRoomTypeInput` | `CreateRoomTypeInput!` | Objeto de entrada para crear un nuevo tipo de habitación. |

#### Devuelve

`RoomType!`

### `createRoomView(createRoomViewInput: CreateRoomViewInput!): RoomView!`

Crea una nueva vista de habitación.

#### Argumentos

| Nombre                | Tipo                   | Descripción                                                 |
| --------------------- | ---------------------- | ----------------------------------------------------------- |
| `createRoomViewInput` | `CreateRoomViewInput!` | Objeto de entrada para crear una nueva vista de habitación. |

#### Devuelve

`RoomView!`

### `executeSeed: String!`

Llena la base de datos con datos iniciales (solo para desarrollo).

#### Devuelve

`String!`

### `updateRoom(updateRoomInput: UpdateRoomInput!): Room!`

Actualiza una habitación existente.

#### Argumentos

| Nombre            | Tipo               | Descripción                                       |
| ----------------- | ------------------ | ------------------------------------------------- |
| `updateRoomInput` | `UpdateRoomInput!` | Objeto de entrada para actualizar una habitación. |

#### Devuelve

`Room!`

### `updateRoomType(updateRoomTypeInput: UpdateRoomTypeInput!): RoomType!`

Actualiza un tipo de habitación existente.

#### Argumentos

| Nombre                | Tipo                   | Descripción                                              |
| --------------------- | ---------------------- | -------------------------------------------------------- |
| `updateRoomTypeInput` | `UpdateRoomTypeInput!` | Objeto de entrada para actualizar un tipo de habitación. |

#### Devuelve

`RoomType!`

### `updateRoomView(updateRoomViewInput: UpdateRoomViewInput!): RoomView!`

Actualiza una vista de habitación existente.

#### Argumentos

| Nombre                | Tipo                   | Descripción                                                |
| --------------------- | ---------------------- | ---------------------------------------------------------- |
| `updateRoomViewInput` | `UpdateRoomViewInput!` | Objeto de entrada para actualizar una vista de habitación. |

#### Devuelve

`RoomView!`

## Objetos de Entrada

### `CreateReservationInput`

Objeto de entrada para crear una nueva reserva.

| Campo          | Tipo       | Descripción                                          |
| -------------- | ---------- | ---------------------------------------------------- |
| `checkIn`      | `String!`  | Fecha y hora de Check In (yyyy-MM-dd HH:mm)          |
| `checkOut`     | `String!`  | Fecha y hora de Check Out (yyyy-MM-dd HH:mm)         |
| `peopleNumber` | `Int!`     | Número de personas para la reserva                   |
| `allInclusive` | `Boolean!` | Indica si la reserva incluye servicios todo incluido |
| `roomTypeId`   | `ID!`      | ID del tipo de habitación deseado                    |

### `CreateRoomInput`

Objeto de entrada para crear una nueva habitación.

| Campo        | Tipo   | Descripción                     |
| ------------ | ------ | ------------------------------- |
| `number`     | `Int!` | Número de la habitación         |
| `roomTypeId` | `ID!`  | ID del tipo de habitación       |
| `roomViewId` | `ID!`  | ID de la vista de la habitación |

### `CreateRoomTypeInput`

Objeto de entrada para crear un nuevo tipo de habitación.

| Campo         | Tipo      | Descripción      |
| ------------- | --------- | ---------------- |
| `name`        | `String!` | Nombre           |
| `basePrice`   | `Float!`  | Precio Base      |
| `maxCapacity` | `Int!`    | Capacidad Máxima |
| `isActive`    | `Boolean` | Está Activo      |

### `CreateRoomViewInput`

Objeto de entrada para crear una nueva vista de habitación.

| Campo      | Tipo      | Descripción                         |
| ---------- | --------- | ----------------------------------- |
| `name`     | `String!` | Nombre de la vista de la habitación |
| `isActive` | `Boolean` | Indica si la vista está activa      |

### `UpdateRoomInput`

Objeto de entrada para actualizar una habitación existente. Al menos un campo debe ser proporcionado.

| Campo        | Tipo  | Descripción                           |
| ------------ | ----- | ------------------------------------- |
| `number`     | `Int` | Nuevo número de la habitación         |
| `roomTypeId` | `ID`  | Nuevo ID del tipo de habitación       |
| `roomViewId` | `ID`  | Nuevo ID de la vista de la habitación |
| `id`         | `ID!` | ID de la habitación a actualizar      |

### `UpdateRoomTypeInput`

Objeto de entrada para actualizar un tipo de habitación existente. Al menos un campo debe ser proporcionado.

| Campo         | Tipo      | Descripción                            |
| ------------- | --------- | -------------------------------------- |
| `name`        | `String`  | Nuevo nombre                           |
| `basePrice`   | `Float`   | Nuevo precio base                      |
| `maxCapacity` | `Int`     | Nueva capacidad máxima                 |
| `isActive`    | `Boolean` | Nuevo estado activo                    |
| `id`          | `ID!`     | ID del tipo de habitación a actualizar |

### `UpdateRoomViewInput`

Objeto de entrada para actualizar una vista de habitación existente. Al menos un campo debe ser proporcionado.

| Campo      | Tipo      | Descripción                                  |
| ---------- | --------- | -------------------------------------------- |
| `name`     | `String`  | Nuevo nombre de la vista de la habitación    |
| `isActive` | `Boolean` | Nuevo estado activo                          |
| `id`       | `ID!`     | ID de la vista de la habitación a actualizar |
