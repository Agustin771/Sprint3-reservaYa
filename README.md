🚀 ReservaYa
ReservaYa es una aplicación web desarrollada con React para el frontend y Java + Spring Boot para el backend, con persistencia de datos en MySQL.

El proyecto implementa autenticación mediante JWT, autorización basada en roles, endpoints protegidos, operaciones CRUD y un panel de administración para gestionar los recursos del sistema. Además, cuenta con tests automatizados para el frontend y el backend, contenedorización con Docker y workflows de GitHub Actions para automatizar procesos de integración y entrega continua.

📌 Características principales
🖥️ Frontend
Interfaz desarrollada con React.
Navegación entre vistas mediante React Router.
Filtrado de productos por categorías.
Filtrado por rangos de fechas.
Acceso al panel de administración.
Gestión de recursos desde una interfaz administrativa.
Operaciones CRUD: creación, consulta, actualización y eliminación.
Componentes visuales e iconografía mediante Lucide React.
Tests automatizados para validar el funcionamiento de la interfaz.
⚙️ Backend
API REST desarrollada con Java y Spring Boot.
Persistencia de datos mediante Spring Data JPA y MySQL.
Autenticación basada en JSON Web Tokens (JWT).
Autorización mediante roles y permisos.
Endpoints protegidos según los permisos del usuario.
Validación de datos de entrada.
Operaciones CRUD para los recursos del sistema.
Tests automatizados para el backend.
🔐 Seguridad
Autenticación mediante JWT.
Control de acceso basado en roles.
Protección de endpoints según los permisos correspondientes.
Integración con Spring Security.
Validación de datos recibidos por la API.
🛠️ Panel de administración

Desde el panel administrativo es posible gestionar los diferentes recursos de la aplicación, incluyendo:

Categorías.
Rangos de fechas.
Productos.
Otros recursos disponibles en el sistema.

Las operaciones de administración permiten crear, consultar, modificar y eliminar registros, manteniendo la persistencia de los datos en MySQL.

🐳 Docker y CI/CD
Dockerfile independiente para el frontend y el backend.
Workflows de GitHub Actions para automatizar procesos del ciclo de desarrollo.
Integración de pruebas automatizadas en el proyecto.
Automatización de tareas mediante pipelines de CI/CD.
🧰 Tecnologías utilizadas
Frontend
Tecnología	Uso
React 19	Desarrollo de la interfaz
React Router	Navegación y enrutamiento
Vite	Desarrollo y compilación
JavaScript ES Modules	Lógica del frontend
Lucide React	Iconografía
Vitest	Ejecución de tests
React Testing Library	Pruebas de componentes
ESLint	Análisis estático y calidad de código
Backend
Tecnología	Uso
Java 17	Lenguaje de programación
Spring Boot	Framework principal
Spring Web MVC	Desarrollo de la API REST
Spring Security	Autenticación y autorización
Spring Data JPA	Persistencia y acceso a datos
Hibernate / JPA	Mapeo objeto-relacional
MySQL	Base de datos relacional
JWT (JJWT)	Generación y validación de tokens
Maven	Gestión de dependencias y compilación
Lombok	Reducción de código repetitivo
Spring Boot Test	Infraestructura de testing
Infraestructura y automatización
Docker
GitHub Actions
CI/CD

🔑 Autenticación y autorización

La seguridad se implementa mediante Spring Security y JWT.

El sistema contempla:

Autenticación de usuarios.
Uso de tokens JWT para identificar solicitudes autenticadas.
Roles para diferenciar los permisos de acceso.
Protección de endpoints según el rol requerido.
Restricción de operaciones administrativas a los usuarios autorizados.

Este enfoque permite separar la autenticación de usuarios de la autorización para acceder a los distintos recursos de la API.

🧪 Testing

El proyecto cuenta con pruebas automatizadas tanto en el frontend como en el backend.

Frontend

Vitest para ejecutar las pruebas.
React Testing Library para probar componentes.
Jest DOM para realizar aserciones sobre el DOM.

Ejecutar los tests:

bash
npm test


Ejecutar los tests en modo watch:

bash
npm run test:watch


Backend

Las pruebas se gestionan mediante Maven y las dependencias de testing de Spring Boot.

Ejecutar los tests desde el directorio del backend:

bash
./mvnw test


En Windows:

powershell
.\mvnw.cmd test


Si el proyecto no incluye Maven Wrapper, se puede utilizar mvn test, siempre que Maven esté instalado.

🐳 Docker

El frontend y el backend cuentan con sus propios Dockerfiles para facilitar la construcción de imágenes y la ejecución de cada componente en contenedores independientes.

Construir la imagen del backend:

bash
docker build -t reservaya-backend ./backend


Construir la imagen del frontend:

bash
docker build -t reservaya-frontend ./frontend

Ajustar las rutas según la estructura real del repositorio. La conexión entre los contenedores y MySQL dependerá de la configuración de red y de las variables de entorno definidas para el proyecto.
🔄 Integración y entrega continua (CI/CD)

El proyecto incorpora workflows de GitHub Actions para automatizar tareas del ciclo de desarrollo.

Esta automatización permite integrar controles y pruebas en el flujo de trabajo del repositorio, contribuyendo a detectar errores y mantener la calidad del código.

Workflows: /.github/workflows/

Los pasos concretos de cada pipeline —por ejemplo, compilación, ejecución de tests, construcción de imágenes o despliegue— dependen de la configuración de los workflows implementados.
⚙️ Instalación y ejecución local
Requisitos previos
Java 17.
Node.js y npm.
MySQL.
Maven, si no se utiliza Maven Wrapper.
Git.
1. Clonar el repositorio
bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_REPOSITORIO>

2. Configurar la base de datos

Crear una base de datos en MySQL y configurar las credenciales de conexión en el backend.

Ejemplo de configuración para application.properties:

properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}


Las variables deben definirse en el entorno de ejecución o adaptarse a la configuración real del proyecto.

3. Ejecutar el backend

Desde el directorio del backend:

bash
./mvnw spring-boot:run


En Windows:

powershell
.\mvnw.cmd spring-boot:run

4. Ejecutar el frontend

Desde el directorio del frontend:

bash
npm install
npm run dev


Vite mostrará la URL local donde estará disponible la aplicación.

La configuración de la URL de la API, las variables de entorno y el puerto del backend debe coincidir con la configuración utilizada en el proyecto.
📂 Estructura del proyecto

La siguiente estructura es orientativa y debe ajustarse a la organización real del repositorio.

text
ReservaYa/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
│
├── .github/
│   └── workflows/
│
└── README.md

📸 Capturas de pantalla

Agregá capturas de la aplicación para mostrar las funcionalidades principales.

Página principal.
Listado de productos y filtros.
Filtrado por categorías y rangos de fechas.
Panel de administración.
Formularios de creación y edición.
Gestión de categorías y productos.

Podés guardar las imágenes en una carpeta docs/images/ y mostrarlas con Markdown:

markdown
![Página principal](docs/images/home.png)

🎯 Objetivos del proyecto
Desarrollar una aplicación Full Stack integrando frontend y backend.
Implementar una API REST con persistencia relacional.
Aplicar autenticación y autorización basada en JWT y roles.
Construir una interfaz administrativa para gestionar recursos mediante operaciones CRUD.
Incorporar pruebas automatizadas en ambas partes de la aplicación.
Aplicar Docker y workflows de CI/CD para mejorar la automatización del desarrollo.
👨‍💻 Autor

[Tu nombre]

GitHub: @tu-usuario
LinkedIn: Tu perfil de LinkedIn

Proyecto desarrollado con React, Java, Spring Boot y MySQL.

📸 Capturas de pantalla

<img width="1232" height="628" alt="Captura de pantalla 2026-10-21 181749" src="https://github.com/user-attachments/assets/c5812905-522d-469a-b265-4fe17e11cc64" />
<img width="1239" height="633" alt="Captura de pantalla 2026-10-21 150121" src="https://github.com/user-attachments/assets/ef094433-30e3-434a-ae0e-7e6374630fcb" />
<img width="1230" height="631" alt="Captura de pantalla 2026-10-21 150329" src="https://github.com/user-attachments/assets/793b7660-6d83-4467-a379-b89214d3fbd5" />
<img width="1348" height="632" alt="Captura de pantalla 2026-10-21 150153" src="https://github.com/user-attachments/assets/d32014aa-195e-4482-b68e-a2e82810eacf" />
<img width="1340" height="405" alt="Captura de pantalla 2026-10-21 150138" src="https://github.com/user-attachments/assets/3b11379d-25f6-49c5-a7ed-ca4900129a0b" />
