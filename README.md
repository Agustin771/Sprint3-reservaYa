🚀 ReservaYa
Sistema de gestión de productos y categorías con arquitectura Full Stack.

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

📸 Capturas de pantalla

<img width="1232" height="628" alt="Captura de pantalla 2026-10-21 181749" src="https://github.com/user-attachments/assets/c5812905-522d-469a-b265-4fe17e11cc64" />
<img width="1239" height="633" alt="Captura de pantalla 2026-10-21 150121" src="https://github.com/user-attachments/assets/ef094433-30e3-434a-ae0e-7e6374630fcb" />
<img width="1230" height="631" alt="Captura de pantalla 2026-10-21 150329" src="https://github.com/user-attachments/assets/793b7660-6d83-4467-a379-b89214d3fbd5" />
<img width="1348" height="632" alt="Captura de pantalla 2026-10-21 150153" src="https://github.com/user-attachments/assets/d32014aa-195e-4482-b68e-a2e82810eacf" />
<img width="1340" height="405" alt="Captura de pantalla 2026-10-21 150138" src="https://github.com/user-attachments/assets/3b11379d-25f6-49c5-a7ed-ca4900129a0b" />
