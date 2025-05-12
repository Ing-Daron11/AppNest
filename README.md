# AppNest – Sistema de Gestión y Alquiler de Equipos

> Backend desarrollado con **NestJS**, enfocado en la administración, reserva y mantenimiento de equipos tecnológicos.  
> Proyecto académico grupal - Computación III (CI-3) - 2025A

---

## 📘 Índice

- [Descripción General](#descripción-general)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Seed de Datos Inicial](#seed-de-datos-inicial)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Endpoints REST Principales](#endpoints-rest-principales)
- [Estrategia de Pruebas](#estrategia-de-pruebas)
- [Documentación Swagger](#documentación-swagger)
- [CI/CD](#cicd)
- [Despliegue en Railway](#despliegue-en-railway)
- [Autores](#autores)

---

## Descripción General

**AppNest** es una aplicación modular, escalable y segura que permite:

- Registrar usuarios con roles diferenciados.
- Administrar equipos (crear, actualizar, buscar, eliminar).
- Controlar el estado de cada equipo (Disponible, Rentado, Mantenimiento).
- Generar reservas y logs de mantenimiento.
- Integrar autenticación vía JWT y protección por roles.

---

## Arquitectura del Proyecto

El sistema se estructura en módulos independientes:

- `auth` – Registro, login, JWT y roles.
- `users` – Gestión de usuarios.
- `equipment` – Gestión completa de equipos.
- `maintenance` – Historial y registro de mantenimientos.
- `reservation` – Reservas de equipos.
- `seed` – Inserción de datos base.

---

## Tecnologías Utilizadas

| Categoría            | Tecnología                        |
| -------------------- | --------------------------------- |
| Framework principal  | [NestJS](https://nestjs.com/)     |
| Lenguaje             | TypeScript                        |
| Base de datos        | PostgreSQL                        |
| ORM                  | TypeORM                           |
| Autenticación        | Passport + JWT                    |
| Validaciones         | class-validator                   |
| Pruebas              | Jest, Supertest                   |
| Containerización     | Docker + Docker Compose           |
| CI/CD                | GitHub Actions                    |
| Hosting              | [Railway](https://railway.app)    |

---

## Seed de Datos Inicial
El proyecto incluye un seeder que crea un usuario administrador al iniciar la aplicación:

```
email: daron@gmail.com
password: daron123
roles: ['admin']
```

## Autenticación y Autorización
### Estrategia
Login con JWT y contraseña encriptada (bcrypt).

Roles: admin, technical, user, dispatcher, superuser.

Decorador personalizado @Auth(...roles) para proteger rutas.

## Endpoints REST Principales

### Auth

| Método | Ruta                     | Acceso         | Descripción                                 |
|--------|--------------------------|----------------|---------------------------------------------|
| POST   | `/auth/register`         | Público        | Registro de nuevo usuario                   |
| POST   | `/auth/login`            | Público        | Login con JWT                               |
| GET    | `/auth/protected`        | Autenticado    | Prueba de ruta protegida básica             |
| GET    | `/auth/private`          | Autenticado    | Prueba con datos de usuario actual          |
| GET    | `/auth/protected2/:id`   | Admin, User    | Prueba de protección por roles              |
| GET    | `/auth/protected3`       | Admin, Technical | Prueba de decorador `@Auth` personalizado |

---

### Users

| Método | Ruta          | Acceso      | Descripción                                 |
|--------|---------------|-------------|---------------------------------------------|
| GET    | `/users/me`   | Autenticado | Obtener perfil del usuario actual           |
| GET    | `/users`      | Admin       | Listar todos los usuarios                   |
| GET    | `/users/:id`  | Admin       | Obtener usuario específico por ID           |
| PATCH  | `/users/:id`  | Admin       | Actualizar usuario (incluye roles)          |
| DELETE | `/users/:id`  | Admin       | Eliminar usuario                            |

---

### Equipment

| Método | Ruta                     | Acceso            | Descripción                                 |
|--------|--------------------------|-------------------|---------------------------------------------|
| POST   | `/equipment`            | Admin             | Crear equipo                                |
| GET    | `/equipment`            | Público           | Listar equipos                              |
| GET    | `/equipment/:term`      | Público           | Buscar equipo por ID o nombre               |
| PATCH  | `/equipment/:id`        | Admin             | Actualizar equipo                            |
| DELETE | `/equipment/:id`        | Admin             | Eliminar equipo                             |
| GET    | `/equipment/search`     | Público           | Buscar equipos con filtros                  |
| PATCH  | `/equipment/status/:id` | Admin, Technical  | Cambiar estado del equipo                   |

---

### Reservations

| Método | Ruta                     | Acceso        | Descripción                                 |
|--------|--------------------------|---------------|---------------------------------------------|
| POST   | `/reservations`         | Autenticado   | Crear reserva de equipo                     |
| GET    | `/reservations`         | Autenticado   | Listar todas las reservas                   |
| GET    | `/reservations/:id`     | Autenticado   | Obtener reserva específica                  |
| PATCH  | `/reservations/:id`     | Autenticado   | Actualizar reserva                          |
| DELETE | `/reservations/:id`     | Autenticado   | Eliminar reserva                            |
| GET    | `/reservations/search`  | Autenticado   | Buscar reservas con filtros                 |

---

### Maintenance

| Método | Ruta                      | Acceso              | Descripción                                |
|--------|---------------------------|---------------------|--------------------------------------------|
| POST   | `/maintenance`           | Admin, Technical    | Crear registro de mantenimiento            |
| GET    | `/maintenance`           | Admin, Technical    | Listar registros de mantenimiento          |
| GET    | `/maintenance/:id`       | Admin, Technical    | Obtener registro específico                |
| PATCH  | `/maintenance/:id`       | Admin, Technical    | Actualizar registro                        |
| DELETE | `/maintenance/:id`       | Admin, Technical    | Eliminar registro                          |
| GET    | `/maintenance/search`    | Admin, Technical    | Buscar registros con filtros               |

---

## Estrategia de Pruebas

### Unitarias (Jest)
* Cubren lógica de servicios y controladores.

* Se testean happy paths y sad paths.

### E2E (Supertest)
* Login + flujo completo (crear, consultar, actualizar, eliminar).

* Validación de status codes, JWT y errores.

## Cobertura General:
| Tipo de prueba | Cobertura                |
| -------------- | ------------------------ |
| Unitarias      | > 80% líneas             |
| E2E            | Casos críticos cubiertos |

### Autores
Este proyecto fue desarrollado por:

* Daron Mercado
* David Malte
* Miguel Martinez