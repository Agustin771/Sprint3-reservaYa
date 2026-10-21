# 📋 BITÁCORA DE CONTROL DE CALIDAD Y PRUEBAS (QA LOG)
**Proyecto:** ReservaYa  
**Fase:** Sprint 2  
**Fecha de Ejecución:** 21 de Octubre de 2026  
**Responsable de QA:** Equipo de Desarrollo / Agus  

---

## 1. Resumen Ejecutivo de QA

Se ha llevado a cabo la ejecución del ciclo completo de pruebas automatizadas sobre el panel de administración, flujo de autenticación, reservas, gestión de favoritos y servicios del cliente para el **Sprint 2** de la aplicación **ReservaYa**.

* **Entorno de Pruebas:** Local (`C:/Users/Agus/Desktop/reservaYa-Sprint2/front`)
* **Framework de Testing:** Vitest v5.0.5 + React Testing Library (@testing-library/react)
* **Entorno de Ejecución:** Node.js / Vite Test Environment
* **Fecha y Hora de Corrida:** 21/10/2026 - 17:36:52
* **Duración Total:** 1.82 segundos
* **Total de Test Files:** 7 ejecutados / 7 pasados
* **Total de Casos de Prueba (Tests):** 15 ejecutados / 15 pasados / 0 fallados
* **Tasa de Éxito:** 100%

---

## 2. Estructura y Alcance de las Pruebas

El alcance de la suite de pruebas abarca tanto la capa de componentes de la interfaz de usuario (UI) como la capa de integración de servicios que interactúan con la API REST del backend (Spring Boot), simulando peticiones HTTP con manejo de tokens JWT en el almacenamiento local (`localStorage`).

### Tecnologías e Integración:
* **UI Testing:** React Testing Library para renderizado sintético y queries del DOM.
* **Service Mocking:** Spies y mocks nativos de Vitest (`vi.fn()`, `vi.mock()`) para interceptación del cliente global `fetch`.
* **Manejo de Sesión:** Simulación sintética del `localStorage` (`reservaYaToken`).

---

## 3. Matriz / Tabla Detallada de Casos de Prueba

| ID | Módulo | Descripción del Test | Resultado Esperado | Resultado Real | Estado |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-APP-01** | App Navigation / Hero | Renderizado de marca `ReservaYa` y eslogan principal en UI | El componente `App` debe renderizar la marca y el eslogan en el DOM. | Marca y eslogan encontrados en pantalla exitosamente. | **PASS** |
| **TC-AUTH-01** | Autenticación | Registro de un usuario nuevo mediante endpoint `/auth/register` | Petición `POST` enviada con datos de usuario formateados en JSON. | Petición `POST` realizada correctamente devolviendo respuesta exitosa. | **PASS** |
| **TC-AUTH-02** | Autenticación | Inicio de sesión de usuario registrado vía `/auth/login` | Petición `POST` enviada con credenciales y retorno del token JWT. | Petición ejecutada devolviendo token de acceso correctamente. | **PASS** |
| **TC-CAT-01** | Categorías | Obtención de lista de categorías con token Bearer en Header | Petición `GET` enviada adjuntando `Authorization: Bearer <token>`. | Header de autorización enviado y lista de categorías retornada. | **PASS** |
| **TC-CAT-02** | Categorías | Creación de nueva categoría vía `POST` | Enviar objeto `{ nombre }` por `POST` a `/api/categorias`. | Petición `POST` realizada exitosamente devolviendo el objeto creado. | **PASS** |
| **TC-PROD-01** | Productos | Obtención del catálogo completo de productos con token | Petición `GET` enviada con Bearer Token a `/api/productos`. | Datos de productos recuperados y parseados correctamente. | **PASS** |
| **TC-PROD-02** | Productos | Alta de producto desde el Panel de Administración | Petición `POST` a `/api/productos` con la estructura en inglés (`name`, `price`, `images`). | Producto creado correctamente y verificado el cuerpo JSON enviado. | **PASS** |
| **TC-FAV-01** | Favoritos | Obtener lista de productos guardados como favoritos | Petición `GET` enviada a `/api/favoritos` con token de usuario. | Lista de favoritos parseada y devuelta sin errores. | **PASS** |
| **TC-FAV-02** | Favoritos | Agregar un producto a la lista de favoritos (`POST`) | Petición `POST` dirigida a `/api/favoritos/{id}`. | Endpoint invocado correctamente con el ID del producto seleccionado. | **PASS** |
| **TC-FAV-03** | Favoritos | Quitar un producto de la lista de favoritos (`DELETE`) | Petición `DELETE` a `/api/favoritos/{id}` respondiendo HTTP 204. | Respuesta 204 procesada retornando `null` correctamente. | **PASS** |
| **TC-RES-01** | Reservas | Creación de reserva especificando producto y fechas | Petición `POST` enviada a `/api/reservas` con cuerpo JSON de reserva. | Reserva registrada devolviendo el ID y estado de confirmación. | **PASS** |
| **TC-RES-02** | Reservas | Consulta del historial de reservas del usuario | Petición `GET` a `/api/reservas/mis-reservas` con encabezado JWT. | Arreglo de reservas del usuario devuelto correctamente. | **PASS** |
| **TC-SAL-01** | Salidas Admin | Obtener lista de fechas de salida para un producto | Petición `GET` enviada a `/api/productos/{id}/salidas`. | Colección de fechas de salida devuelta correctamente. | **PASS** |
| **TC-SAL-02** | Salidas Admin | Alta de salida con fechas y cupos disponibles (`POST`) | Petición `POST` a `/api/productos/{id}/salidas` con cupos e intervalos. | Nueva fecha de salida registrada en la API. | **PASS** |
| **TC-SAL-03** | Salidas Admin | Cancelación / Eliminación de salida registrada (`DELETE`) | Petición `DELETE` enviada a `/api/productos/{id}/salidas/{salidaId}`. | Salida eliminada exitosamente del catálogo. | **PASS** |

---

## 4. Registro de Incidencias y Hallazgos (Bug Reporting & Corrections)

Durante la preparación del entorno y las primeras ejecuciones del ciclo de QA se identificaron las siguientes incidencias, las cuales fueron resueltas antes de dar por cerrado el Sprint:

### Incidencia 1: Error de cabecera de autenticación no enviada en Favoritos
* **Descripción:** La función `obtenerFavoritos` realizaba peticiones sin agregar el prefijo `Bearer` en el encabezado `Authorization`.
* **Efecto:** El backend devolvía código HTTP 401 Unauthorized en llamadas de usuarios autenticados.
* **Acción Correctiva:** Se implementó el helper `obtenerToken()` dentro del archivo `favoritos.js` para inyectar automáticamente `Bearer ${token}` en las peticiones.
* **Estado:** **Resuelto / Verificado en TC-FAV-01**.

### Incidencia 2: Falta de normalización en el parseo de respuestas HTTP 204 (No Content)
* **Descripción:** Al eliminar categorías o salidas, la API devolvía un código `HTTP 204 No Content`. El código intentaba ejecutar `response.json()`, lo que disparaba la excepción `SyntaxError: Unexpected end of JSON input`.
* **Efecto:** Fallo irrecuperable en el cliente React tras eliminar una salida o categoría.
* **Acción Correctiva:** Se agregaron validaciones explícitas `if (response.status === 204) return null;` en los clientes de peticiones HTTP (`request()`).
* **Estado:** **Resuelto / Verificado en TC-FAV-03 y TC-SAL-03**.

---

## 5. Conclusión y Firma de QA
En conclusión, las pruebas realizadas sobre ReservaYa dieron resultados positivos, ya que los 15 casos de prueba se ejecutaron correctamente, sin errores en la última corrida. Se pudo comprobar el funcionamiento de las principales funcionalidades del sistema, como el inicio de sesión, el registro de usuarios, la gestión de productos y categorías, las reservas, los favoritos y las fechas de salida.

Durante las primeras pruebas también aparecieron algunos errores relacionados con el envío del token de autenticación y el manejo de las respuestas vacías de la API. Estos problemas se fueron corrigiendo y se volvieron a probar para comprobar que funcionaran correctamente.

En base a los resultados obtenidos, podemos decir que el sistema cumple con lo esperado para esta etapa del proyecto y que las funcionalidades probadas responden de manera correcta. De esta forma, damos por finalizada la etapa de QA del Sprint 2, dejando el proyecto en condiciones de ser presentado y entregado.

Dictamen final: APROBADO para la entrega del Sprint 2.

```text
       _____________________________________
               Firma Responsable QA
           Agustin Perez - Para proyecto final
                 ReservaYa 2026
```