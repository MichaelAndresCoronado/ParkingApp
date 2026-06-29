# 🅿️ ParkingApp - Sistema de Gestión de Estacionamientos

## 📋 Descripción General

**ParkingApp** es una plataforma moderna de gestión de estacionamientos desarrollada con una arquitectura de microservicios. El sistema permite administrar zonas de estacionamiento, vehículos, tickets de estacionamiento y usuarios con roles y autenticación.

### 🎯 Características Principales

- ✅ Gestión de zonas y espacios de estacionamiento
- ✅ Registro y control de vehículos
- ✅ Emisión y seguimiento de tickets de estacionamiento
- ✅ Sistema de autenticación y roles de usuarios
- ✅ API Gateway para enrutamiento centralizado
- ✅ Arquitectura escalable basada en microservicios
- ✅ Contenerización con Docker

---

## 🏗️ Arquitectura del Sistema

### Estructura del Proyecto
ParkingApp/
├── App/
│ ├── spring-boot-services/ # Microservicios Spring Boot
│ │ ├── ms-zonas-espaços/ # Gestión de zonas y espacios
│ │ ├── ms-usuarios-roles-auth/ # Autenticación y roles
│ │ └── pom.xml # POM padre compartido
│ │
│ ├── nestjs-services/ # Microservicios NestJS
│ │ ├── ms-vehículos/ # Gestión de vehículos
│ │ ├── ms-tickets/ # Gestión de tickets
│ │ └── package.json # Workspace compartido
│ │
│ └── kong.yml # Configuración API Gateway
│
├── Frontend/ # Frontend (próximamente)
├── docker-compose.yml # Orquestación de contenedores
├── .env # Variables de entorno
└── README.md

text

### Microservicios

| Microservicio | Tecnología | Puerto | Descripción |
|---------------|------------|--------|-------------|
| **ms-zonas-espaços** | Spring Boot 3.1.5 | 8081 | Gestión de zonas y espacios de estacionamiento |
| **ms-usuarios-roles-auth** | Spring Boot 3.1.5 | 8082 | Autenticación, usuarios y roles |
| **ms-vehículos** | NestJS 10 | 8083 | Registro y gestión de vehículos |
| **ms-tickets** | NestJS 10 | 8084 | Emisión y control de tickets |
| **API Gateway** | Kong | 8000 | Enrutamiento y seguridad centralizada |

---

## 🚀 Requisitos Previos

### Software Necesario

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| **Java** | 17+ | Ejecutar microservicios Spring Boot |
| **Maven** | 3.9+ | Gestión de dependencias Spring Boot |
| **Node.js** | 18+ | Ejecutar microservicios NestJS |
| **npm** | 9+ | Gestión de dependencias NestJS |
| **Docker** | 24+ | Contenerización de servicios |
| **Docker Compose** | 2.20+ | Orquestación de contenedores |
| **Git** | 2.40+ | Control de versiones |

### Bases de Datos

- **PostgreSQL**: Para microservicios Spring Boot
- **MongoDB**: Para microservicios NestJS

---

## 📦 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/MichaelAndresCoronado/ParkingApp.git
cd ParkingApp
2. Configurar Variables de Entorno
Crea un archivo .env en la raíz:

env
# Spring Boot Services
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/parkingapp
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password

# NestJS Services
MONGODB_URI=mongodb://localhost:27017/parkingapp

# JWT Configuration
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRATION=3600

# API Gateway
KONG_PORT=8000
3. Configurar Microservicios Spring Boot
bash
# Navegar a la carpeta de servicios Spring Boot
cd App/spring-boot-services

# Instalar dependencias y construir
mvn clean install

# Construir un microservicio específico
cd ms-zonas-espaços
mvn clean package
4. Configurar Microservicios NestJS
bash
# Navegar a la carpeta de servicios NestJS
cd App/nestjs-services

# Instalar dependencias de todos los servicios
npm install

# Instalar dependencias de un servicio específico
cd ms-vehículos
npm install
🐳 Ejecución con Docker
Iniciar Todos los Servicios
bash
# Desde la raíz del proyecto
docker-compose up -d

# Verificar que todos los contenedores estén corriendo
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs -f
Iniciar Servicios Específicos
bash
# Iniciar solo los servicios Spring Boot
docker-compose up -d ms-zonas-espaços ms-usuarios-roles-auth

# Iniciar solo los servicios NestJS
docker-compose up -d ms-vehículos ms-tickets

# Iniciar solo el API Gateway
docker-compose up -d kong
Comandos Útiles de Docker
bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir imágenes
docker-compose up -d --build

# Ver logs de un servicio específico
docker-compose logs -f ms-zonas-espaços

# Acceder al shell de un contenedor
docker exec -it ms-zonas-espaços /bin/bash
🔧 Ejecución en Desarrollo
Spring Boot Microservices
bash
# Desde la carpeta del microservicio
cd App/spring-boot-services/ms-zonas-espaços
mvn spring-boot:run

# Con perfil específico
mvn spring-boot:run -Dspring-boot.run.profiles=dev
NestJS Microservices
bash
# Desde la carpeta del microservicio
cd App/nestjs-services/ms-vehículos
npm run start:dev

# En modo producción
npm run build
npm run start:prod
📡 API Gateway - Kong
El API Gateway centraliza todas las solicitudes y las redirige a los microservicios correspondientes.

Configuración de Rutas (kong.yml)
yaml
services:
  - name: zonas-service
    url: http://ms-zonas-espaços:8080
    routes:
      - name: zonas-routes
        paths:
          - /zonas
          - /espacios
  
  - name: usuarios-service
    url: http://ms-usuarios-roles-auth:8080
    routes:
      - name: usuarios-routes
        paths:
          - /usuarios
          - /auth
          - /roles
  
  - name: vehiculos-service
    url: http://ms-vehículos:3000
    routes:
      - name: vehiculos-routes
        paths:
          - /vehiculos
  
  - name: tickets-service
    url: http://ms-tickets:3000
    routes:
      - name: tickets-routes
        paths:
          - /tickets
Acceso a los Endpoints
Endpoint	Servicio	Método	Descripción
/zonas	ms-zonas-espaços	GET/POST	Gestionar zonas
/espacios	ms-zonas-espaços	GET/POST	Gestionar espacios
/usuarios	ms-usuarios-roles-auth	GET/POST	Gestionar usuarios
/auth/login	ms-usuarios-roles-auth	POST	Autenticación
/vehiculos	ms-vehículos	GET/POST	Gestionar vehículos
/tickets	ms-tickets	GET/POST	Gestionar tickets
📚 Documentación de APIs
Microservicio: ms-zonas-espaços (Spring Boot)
Método	Endpoint	Descripción	Autenticación
GET	/api/zonas	Listar todas las zonas	Bearer Token
POST	/api/zonas	Crear nueva zona	Bearer Token
GET	/api/zonas/{id}	Obtener zona por ID	Bearer Token
PUT	/api/zonas/{id}	Actualizar zona	Bearer Token
DELETE	/api/zonas/{id}	Eliminar zona	Bearer Token
GET	/api/espacios/disponibles	Listar espacios disponibles	Bearer Token
POST	/api/espacios/reservar	Reservar espacio	Bearer Token
Microservicio: ms-usuarios-roles-auth (Spring Boot)
Método	Endpoint	Descripción	Autenticación
POST	/api/auth/register	Registrar nuevo usuario	No
POST	/api/auth/login	Iniciar sesión	No
POST	/api/auth/logout	Cerrar sesión	Bearer Token
GET	/api/usuarios	Listar usuarios	Bearer Token (Admin)
PUT	/api/usuarios/{id}	Actualizar usuario	Bearer Token
DELETE	/api/usuarios/{id}	Eliminar usuario	Bearer Token (Admin)
GET	/api/roles	Listar roles	Bearer Token (Admin)
Microservicio: ms-vehículos (NestJS)
Método	Endpoint	Descripción	Autenticación
POST	/api/vehiculos	Registrar vehículo	Bearer Token
GET	/api/vehiculos	Listar vehículos del usuario	Bearer Token
GET	/api/vehiculos/{id}	Obtener vehículo por ID	Bearer Token
PUT	/api/vehiculos/{id}	Actualizar vehículo	Bearer Token
DELETE	/api/vehiculos/{id}	Eliminar vehículo	Bearer Token
Microservicio: ms-tickets (NestJS)
Método	Endpoint	Descripción	Autenticación
POST	/api/tickets	Crear ticket de estacionamiento	Bearer Token
GET	/api/tickets	Listar tickets del usuario	Bearer Token
GET	/api/tickets/{id}	Obtener ticket por ID	Bearer Token
PUT	/api/tickets/{id}/cerrar	Cerrar ticket (finalizar)	Bearer Token
GET	/api/tickets/activos	Listar tickets activos	Bearer Token
🔐 Autenticación y Seguridad
Flujo de Autenticación
El usuario se registra en /auth/register

Inicia sesión en /auth/login y recibe un JWT token

Incluye el token en el header de las peticiones:

text
Authorization: Bearer <your_jwt_token>
Roles del Sistema
Rol	Descripción	Permisos
ADMIN	Administrador del sistema	Acceso total a todas las funcionalidades
OPERADOR	Operador de estacionamiento	Gestión de tickets y espacios
USER	Usuario regular	Gestión de sus vehículos y tickets
GUEST	Invitado	Solo consulta de espacios disponibles
🧪 Testing
Spring Boot Microservices
bash
# Ejecutar pruebas unitarias
mvn test

# Ejecutar pruebas de integración
mvn verify

# Generar reporte de cobertura
mvn jacoco:report
NestJS Microservices
bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas de integración
npm run test:e2e

# Generar reporte de cobertura
npm run test:cov
📊 Monitoreo y Logs
Visualización de Logs
bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f ms-zonas-espaços
docker-compose logs -f ms-vehículos

# Últimas 100 líneas
docker-compose logs --tail=100
Health Checks
Servicio	Health Check Endpoint
ms-zonas-espaços	/actuator/health
ms-usuarios-roles-auth	/actuator/health
ms-vehículos	/health
ms-tickets	/health
Kong	/status
🛠️ Mantenimiento
Actualizar Dependencias
Spring Boot:

bash
cd App/spring-boot-services
mvn versions:display-dependency-updates
mvn versions:update-properties
NestJS:

bash
cd App/nestjs-services
npm outdated
npm update
Limpiar y Reconstruir
bash
# Limpiar todo
docker-compose down -v
docker system prune -a

# Reconstruir
docker-compose up -d --build
🤝 Contribución
Fork el repositorio

Crea tu feature branch: git checkout -b feature/nueva-funcionalidad

Commit tus cambios: git commit -m 'Agrega nueva funcionalidad'

Push a la rama: git push origin feature/nueva-funcionalidad

Abre un Pull Request

Estándares de Código
Spring Boot: Java 17, seguir convenciones de Spring

NestJS: TypeScript, seguir guía de estilo de Angular

Commits: Usar Conventional Commits

📝 Tecnologías Utilizadas
Backend - Spring Boot
✅ Spring Boot 3.1.5

✅ Spring Security 6.1.5

✅ Spring Data JPA 3.1.5

✅ PostgreSQL 15

✅ JWT 0.9.1

✅ Maven 3.9+

✅ Lombok

Backend - NestJS
✅ NestJS 10

✅ TypeScript 5

✅ Mongoose 7

✅ MongoDB 6

✅ PassportJS (JWT)

✅ Jest (Testing)

Infraestructura
✅ Docker 24

✅ Docker Compose 2.20

✅ Kong API Gateway 3.4

✅ NGINX (Próximamente)

Frontend (Próximamente)
✅ React 18 / Next.js 14

✅ Tailwind CSS

✅ TypeScript

📄 Licencia
Este proyecto está bajo la licencia MIT - ver el archivo LICENSE para más detalles.

👨‍💻 Autor
Michael Andrés Coronado

GitHub: @MichaelAndresCoronado

LinkedIn: Michael Andrés Coronado

🙏 Agradecimientos
Equipo de desarrollo por la colaboración

Comunidad Open Source por las herramientas utilizadas

📞 Contacto y Soporte
Para preguntas o soporte, por favor abre un issue en el repositorio.

¡Gracias por usar ParkingApp! 🚗💨

text

## Cómo agregar el README a tu repositorio

```cmd
# 1. Crear el archivo README.md
cd ParkingApp
echo # ParkingApp > README.md

# 2. Copiar y pegar todo el contenido de arriba en el archivo

# 3. Agregar y subir cambios
git add README.md
git commit -m "Agregado README completo con documentación del proyecto"
git push origin main
