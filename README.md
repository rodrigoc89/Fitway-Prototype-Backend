# Fitway Prototype Backend

Fitway Prototype Backend es una aplicación de backend desarrollada para el proyecto Fitway. Proporciona una API para gestionar rutinas de ejercicios, ejercicios y superseries.

## Tabla de contenidos

1. Introducción
2. Requisitos previos
3. Instalación
4. Configuración
5. Uso
6. API
   - Endpoints de rutinas
   - Endpoints de ejercicios
   - Endpoints de superseries
7. Contribuir
8. Licencia

## Introducción

Fitway Prototype Backend es una aplicación desarrollada con Node.js y Express.js. Se basa en una base de datos PostgreSQL y utiliza Sequelize como ORM (Object-Relational Mapping).

La aplicación proporciona una API RESTful que permite crear, leer, actualizar y eliminar rutinas, ejercicios y superseries. Está diseñada para ser utilizada por la aplicación frontend de Fitway para gestionar los datos relacionados con el fitness y los entrenamientos.

## Requisitos previos

Antes de instalar y ejecutar Fitway Prototype Backend, asegúrate de tener los siguientes requisitos previos en tu sistema:

- Node.js (versión X.X.X)
- PostgreSQL (versión X.X.X)

## Instalación

Sigue estos pasos para instalar Fitway Prototype Backend en tu sistema:

1. Clona el repositorio de GitHub:

```bash
git clone https://github.com/rodrigoc89/Fitway-Prototype-Backend.git
```

2. Navega al directorio del proyecto:

```bash
cd Fitway-Prototype-Backend
```

3. Instala las dependencias:

```bash
npm install
```

## Configuración

Antes de ejecutar la aplicación, asegúrate de configurar los siguientes archivos de configuración:

1. .env: Este archivo contiene las variables de entorno necesarias para la configuración de la base de datos y otros ajustes de la aplicación.

2. config/database.js: Este archivo define la configuración de la base de datos, como el nombre de la base de datos, el nombre de usuario, la contraseña, el host y el puerto.

Asegúrate de completar los valores adecuados en estos archivos de configuración antes de continuar.

## Uso

Para ejecutar Fitway Prototype Backend, sigue estos pasos:

1. Asegúrate de que tu servidor PostgreSQL esté en funcionamiento.

2. Ejecuta el siguiente comando en el directorio del proyecto:

```sql
npm start
```

La aplicación se iniciará y estará disponible en http://localhost:3000.

## API

La API de Fitway Prototype Backend se basa en los siguientes endpoints:

### Endpoints de rutinas

- GET /routines: Obtiene todas las rutinas.
- GET /routines/:id: Obtiene una rutina específica por su ID.
- POST /routines: Crea una nueva rutina.
- PUT /routines/:id: Actualiza una rutina existente por su ID.
- ELETE /routines/:id: Elimina una rutina existente por su ID.

### Endpoints de ejercicios

- GET /exercises: Obtiene todos los ejercicios.
- GET /exercises/:id: Obtiene un ejercicio específico por su ID.
- POST /exercises: Crea un nuevo ejercicio.
- PUT /exercises/:id: Actualiza un ejercicio existente por su ID.
- DELETE /exercises/:id: Elimina un ejercicio existente por su ID.

### Endpoints de superseries

- GET /supersets: Obtiene todas las superseries.
- GET /supersets/:id: Obtiene una superserie específica por su ID.
- POST /supersets: Crea una nueva superserie.
- PUT /supersets/:id: Actualiza una superserie existente por su ID.
- DELETE /supersets/:id: Elimina una superserie existente por su ID.

## Contribuir

Si deseas contribuir al desarrollo de Fitway Prototype Backend, sigue estos pasos:

1. Haz un fork del repositorio Fitway-Prototype-Backend en GitHub.

2. Clona tu fork a tu máquina local:

```bash
git clone https://github.com/TU_USUARIO/Fitway-Prototype-Backend.git
```

3. Crea una rama local para tus cambios:

```bash
git checkout -b feature/nombre-de-la-funcionalidad
```

4. Realiza tus modificaciones y haz commit de los cambios:

```sql
git add .
git commit -m "Descripción de los cambios"
```

5. Envía tus cambios a tu fork en GitHub:

```bash
git push origin feature/nombre-de-la-funcionalidad
```

6. Crea una pull request en el repositorio principal Fitway-Prototype-Backend para revisar tus cambios.

## Licencia

Fitway Prototype Backend se distribuye bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
