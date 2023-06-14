# Fitway Prototype Backend

Fitway Prototype Backend es una aplicación de backend desarrollada para el proyecto Fitway. Proporciona una API para gestionar rutinas de ejercicios, ejercicios y superseries.

## Tabla de contenidos

1. Introducción
2. Requisitos previos
3. Instalación
4. Configuración
5. Uso
6. API
   - Endpoints de usuarios
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

```bash
npm start
```

La aplicación se iniciará y estará disponible en http://localhost:3001.

## API

La API de Fitway Prototype Backend se basa en los siguientes endpoints:

#### api base path : `/api`

### Endpoints de Usuarios

<details><summary> Ver </summary>

#### router : `/users`

- `POST /users/register`

  ```
  Parámetros de solicitud:
  { name, lastName, birthdate, password, email, country }
  ```

  ```
  Respuesta:
  (token)
  ERROR {message: "There was a problem creating the user"}
  ```

- `POST /users/login`

  ```
  Parámetros de solicitud:
  { email, password }
  ```

  ```
  Respuesta:
  (token)
  {message: "Invalid user"}
  {message: "Invalid password"}
  ERROR {message: "There was a problem login the user"}
  ```

- `POST /users/logout`

- `GET users/`

  ```
  Respuesta:
  [
      {
          "id": 1,
          "name": "",
          "lastName": "",
          "birthdate": "",
          "country": "",
          "email": ""
      }
  ]
  ERROR {message: "There was a problem finding all users"}
  ```

- `GET /users/:userId`

  ```
  Respuesta:
  {
      "id": 1,
      "name": "",
      "lastName": "",
      "birthdate": "",
      "country": "",
      "email": ""
  }
  ERROR {message: "There was a problem finding the user"}
  ```

- `GET /users/data/token`

  ```
  Parámetros de solicitud:
  header authorization: (token)
  ```

  ```
  Respuesta:
  {
      "id": 1,
      "fullName": "",
      "birthday": "",
      "email": ""
  }
  { message: "User not found" }
  ERROR { message: "Invalid token" }
  ```

- `GET /users/routines/:userId`

  ```
  Respuesta:
  {
      "id": 1,
      "name": "",
      "lastName": "",
      "birthdate": "",
      "country": "",
      "email": "",
      "Routines": []
  }
  { message: "User not found" }
  ERROR {message: "There was a problem finding the user routines"}
  ```

- `GET /users/exercises/:userId`

  ```
  Respuesta:
  NO SE
  ERROR {message: "There was a problem finding the user exercises"}
  ```

- `GET /users/superSets/:userId`

  ```
  Respuesta:
  NO SE
  ERROR {message: "There was a problem finding the user superset"}
  ```

- ` POST /users/editProfile/:id`

  ```
  Parámetros de solicitud:
  { weight }
  ```

  ```
  Respuesta:
  {
      "id": 1,
      "name": "",
      "lastName": "",
      "birthdate": "",
      "country": "",
      "email": "",
      "password": "",
      "salt": ""
  }
  { message: "User not found" }
  ERROR {message: "There was a problem updating the user information"}
  ```

- `POST /users/emailValidate`

  ```
  Parámetros de solicitud:
  { email }
  ```

  ```
  Respuesta:
  {message: "the email already exists"}
  {message: "Email is available for registration."}
  ERROR {message: "There was a problem checking the email"}
  ```

</details>

### Endpoints de rutinas

<datails><summary>Ver</summary>

#### router : `/routine`

- `GET /routine/`

  ```
  Respuesta:
  []
  ERROR {message: "There was a problem finding all routines"}
  ```

- `GET /routine/`:routineId

  ```
  Respuesta:
  NO SE
  ERROR {message: "There was a problem finding the routine"}
  ```

- `POST /routine/newRoutine/:userId`

  ```
  Parámetros de solicitud:
  { name, selectDay, description }
  ```

  ```
  Respuesta:
  NO SE
  ERROR { message: "There was a problem creating Routine"}
  ```

- `PUT /routine/updateRoutine/:routineId`

  ```
  Parámetros de solicitud:
  { name, selectDay, description }
  ```

  ```
  Respuesta:
  NO SE
  { message: "routine not found" }
  ERROR {message: "There was a problem updating the routine"}
  ```

- `DELETE /routine/deleteRoutine/:routineId`

  ```
  Respuesta:
  { message: "the routine has been removed" }
  ERROR {message: "There was a problem deleting the routine"}
  ```

</details>

### Endpoints de ejercicios

<details><summary> Ver </summary>

#### router : `/exercise`

- `GET /exercise/`

  ```
  Respuesta:
  NO SE
  ERROR {message: "There was a problem finding all exercises"}
  ```

- `GET /exercise/:ExerciseId`

  ```
  Respuesta:
  NO SE
  ERROR {"There was a problem finding the exercise"}
  ```

- `POST /exercise/newExercise`

  ```
  Parámetros de solicitud:
  {
    name, reps, element, rest, muscle, series, description, parent, parentId,  userId,
  }
  ```

  ```
  Respuesta:
  NO SE
  ERROR {message: "There was a problem creating the Exercise"}
  ```

- `POST /exercise/addExercise`

  ```
  Parámetros de solicitud:
  { parent, parentId, exerciseId }
  ```

  ```
  Respuesta:
  NO SE
  {message: "exercise not found"}
  ERROR {message: "There was a problem adding the Exercise"}
  ```

- `PUT /exercise/editExercise/:exerciseId`

  ```
  Parámetros de solicitud:
  { name, reps, element, rest, muscle, series, description }
  ```

  ```
  Respuesta:
  NO SE
  { message: "exercise not found" }
  ERROR {message: "There was a problem updating the Exercise"}
  ```

- `DELETE /exercise/deleteExercise/:exerciseId`

  ```
  Respuesta:
  { message: "the exercise has been removed" }
  ERROR {message: "There was a problem deleting the Exercise"}
  ```

<details>

### Endpoints de superseries

<details><summary> Ver </summary>

#### router : `/superset`

- `GET /superset/`

  ```
  Respuesta:
  NO SE
  ERROR {message: "There was a problem finding all superSets"}
  ```

- `GET /superset/:supersetId`

  ```
  Respuesta:
  NO SE
  ERROR {message: "There was a problem finding the superset"}
  ```

- `POST /superset/`

  ```
  Parámetros de solicitud:
  { userId, parent, parentId }
  ```

  ```
  Respuesta:
  NO SE
  ERROR {message: "There was a problem creating superset"}
  ```

- `DELETE /superset/deleteSuperset/:supersetId`

  ```
  Respuesta:
  { message: "the superset has been removed" }
  ERROR {message: "There was a problem deleting the superset"}
  ```

<details>

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

```bash
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
