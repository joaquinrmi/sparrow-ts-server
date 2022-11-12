# Sparrow (server)

Sparrow es una aplicación que pretende imitar el comportamiento de los principales componentes de Twitter. Su objetivo es servir como proyecto para mi portfolio, además de permitirme aplicar los conocimientos adquiridos sobre desarrollo web.

Podés ver el repositorio de la aplicación cliente en [https://github.com/joaquinrmi/sparrow-ts-client](https://github.com/joaquinrmi/sparrow-ts-client).

## Índice

* [Aplicación desplegada](#aplicación-desplegada)
* [Instalación](#instalación)
    * [Prerequisitos](#prerequisitos)
    * [Procedimiento](#procedimiento)
    * [Variables de entorno](#variables-de-entorno)
* [Documentación de la API](#documentación-de-la-api)
    * [Códigos de estado](#códigos-de-estado)
    * [Mensaje de respuesta](#mensaje-de-respuesta)
    * [Errores](#errores)
        * [`ErrorResponse`](#errorresponse)
        * [`APIError`](#apierror)
        * [Ejemplo de respuesta de error](#ejemplo-de-respuesta-de-error)
    * [Lista de `ErrorResponse`](#lista-de-errorresponse)
    * [Errores Comunes](#errores-comunes)
    * [Códigos de error](#códigos-de-error)
    * [Referencia de objetos](#referencia-de-objetos)
        * [`UserShortInformation`](#usershortinformation)
        * [`UserCellData`](#usercelldata)
        * [`SearchUserResult`](#searchuserresult)
        * [`CheepData`](#cheepdata)
        * [`SearchCheepsResult`](#searchcheepsresult)
    * [User API](#user-api)
        * [GET `/api/user`](#get-apiuser)
        * [POST `/api/user`](#post-apiuser)
        * [GET `/api/user/current`](#get-apiusercurrent)
        * [POST `/api/user/auth`](#post-apiuserauth)
        * [POST `/api/user/follow/:userHandle`](#post-apiuserfollowuserhandle)
        * [DELETE `/api/user/unfollow/:userHandle`](#delete-apiuserunfollowuserhandle)
        * [GET `/api/user/follower-list`](#get-apiuserfollower-list)
        * [GET `/api/user/following-list`](#get-apiuserfollowing-list)
        * [GET `/api/user/recommended-list`](#get-apiuserrecommended-list)
        * [GET `/api/user/users-liked-list`](#get-apiuserusers-liked-list)
        * [GET `/api/user/users-recheeped-list`](#get-apiuserusers-recheeped-list)
    * [Cheep API](#cheep-api)
        * [GET `/api/cheep`](#get-apicheep)
        * [POST `/api/cheep`](#post-apicheep)
        * [GET `/api/cheep/liked-list`](#get-apicheepliked-list)
        * [GET `/api/cheep/timeline`](#get-apicheeptimeline)
        * [GET `/api/cheep/explore`](#get-apicheepexplore)
        * [POST `/api/cheep/like/:cheepId`](#post-apicheeplikecheepid)
        * [DELETE `/api/cheep/like/:cheepId`](#delete-apicheeplikecheepid)
        * [DELETE `/api/cheep/recheep/:cheepId`](#delete-apicheeprecheepcheepid)
        * [GET `/api/cheep/:cheepId`](#get-apicheepcheepid)
        * [DELETE `/api/cheep/:cheepId`](#delete-apicheepcheepid)
    * [Profile API](#profile-api)
        * [PATCH `/api/profile`](#patch-apiprofile)
        * [GET `/api/profile/:userHandle`](#get-apiprofileuserhandle)
    * [Upload API](#upload-api)
        * [POST `/api/upload/gallery`](#post-apiuploadgallery)
        * [POST `/api/upload/profile`](#post-apiuploadprofile)
        * [POST `/api/upload/banner`](#post-apiuploadbanner)

## Aplicación desplegada

Podés visitar Sparrow en el siguiente enlace: [https://sparrow.onrender.com/](https://sparrow.onrender.com/).

La aplicación back end está alojada en [https://sparrow-server.onrender.com/](https://sparrow-server.onrender.com/).

## Instalación

### Prerequisitos

* Node.js versión 12.x.
* Una cuenta en [Cloudinary](https://cloudinary.com/).
* Una base de datos de PostgreSQL.

### Procedimiento

1. Clonar este repositorio.
    ```
    git clone https://github.com/joaquinrmi/sparrow-ts-server.git
    ```
1. Navegar a la carpeta del repositorio.
1. Instalar las dependencias.
    ```
    npm install
    ```
1. Configurar las variables de entorno (ver [Variables de entorno](#variables-de-entorno)).
1. Ejecutar la aplicación:
    * en un servidor de desarrollo
        ```
            npm run dev
        ```
    o
    1. compilar un paquete de producción
        ```
            npm run build
        ```
    1. ejecutar
        ```
            npm start
        ```

### Variables de entorno

* `CLIENT_APP`: url de la aplicación cliente.
* `PORT`: puerto en el que se configurará el servidor.
* `ENCRYPT_SECRET`: clave para encriptar las contraseñas.
* `TOKEN_SECRET`: clave para encriptar el *token* se sesión.
* `DATABASE_URL`: url para conectar con la base de datos.
* `CLOUD_NAME`, `CLOUD_API_KEY` y `CLOUD_API_SECRET`: información para conectar con la aplicación de Cloudinary.

## Documentación de la API

### Códigos de estado

| Nombre | Código |
|--------|--------|
| Ok | 200 |
| Created | 201 |
| No Content | 204 |
| Bad Request | 400 |
| Unauthorized | 401 |
| Forbidden | 403 |
| Not Found | 404 |
| Conflict | 409 |
| Internal Server Error | 500 |

### Mensaje de respuesta

La documentación de las respuestas exitosas seguirá el siguiente patrón:
* ***Status code***: nombre del código de estado (ver [Códigos de estado](#códigos-de-estado)).
* **Cuerpo**: definición del objeto `JSON` enviado en el *body* de la respuesta o `undefined` en caso de no incluir ninguno.

### Errores

Si ocurre un error al procesar una solicitud en el servidor, entonces se envía un mensaje de error `ErrorResponse` (ver [Lista de `ErrorResponse`](#lista-de-errorresponse)). El objeto `ErrorResponse` consta de dos atributos: un título y una lista de `APIError`. Esto significa que una respuesta de error puede contener varias descripciones de errores diferentes (está garantizado de que, al menos, habrá un error en la lista).

#### ErrorResponse
```json
{
    "title": "string",
    "errors": [ "APIError" ]
}
```
* `title` es un título general sobre el error.
* `errors` es un arreglo con objetos de tipo `APIError`.

#### APIError
```json
{
    "code": "number",
    "title": "string",
    "description": "string"
}
```
* `code` es el código único que identifica el error (ver [Códigos de error](#códigos-de-error)).
* `title` es el nombre que recibe el error.
* `description` es una breve descripción sobre el error.

#### Ejemplo de respuesta de error
```json
{
    "title": "An Error Has Ocurred",
    "errors": [
        {
            "code": 1000,
            "title": "Internal Server Error",
            "description": "No description available"
        }
    ]
}
```

### Lista de `ErrorResponse`

#### `InternalServerErrorResponse`
* ***Status code***: `InternalServerError`.
* **Posibles códigos de error**: `1000`.

#### `InvalidCredentialsResponse`
* ***Status code***: `Unauthorized`.
* **Posibles códigos de error**: `1500`.

#### `InvalidSignupFormResponse`
* ***Status code***: `BadRequest`.
* **Posibles códigos de error**: `1301` - `1302` - `1303` - `1304` - `1305`.

#### `UnavailableHandleResponse`
* ***Status code***: `Conflict`.
* **Posibles códigos de error**: `1400`.

#### `UnavailableEmailResponse`
* ***Status code***: `Conflict`.
* **Posibles códigos de error**: `1401`.

#### `InvalidFollowersListParamsResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1602` - `1605`.

#### `InvalidRecommendedListParamsResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1602`.

#### `InvalidUsersLikedListParamsResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1602` - `1603`.

#### `InvalidSearchCheepsParamsResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1602` - `1605` - `1606` - `1607` - `1608` - `1609` - `1610` - `1611`.

#### `InvalidCreateCheepFormResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1306` - `1307` - `1308` - `1309`.

#### `RecheepAlreadyExistsResponse`
* ***Status code***: `Conflict`.
* **Posibles códigos de error**: `1900`.

#### `InvalidLikedCheepsParamsResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1602` - `1605`.

#### `InvalidGetTimelineParamsResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1602`.

#### `InvalidExploreParamsResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1602`.

#### `InvalidLikeParamsResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1603`.

#### `InvalidDeleteRecheepParamsResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1603`.

#### `InvalidGetCheepParamsResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1603`.

#### `CheepNotFoundResponse`
* ***Status code***: `Not Found`.
* **Posibles códigos de error**: `2000`.

#### `InvalidDeleteCheepParamsResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1603`.

#### `InvalidUpdateProfileFormResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1305`.

#### `InvalidGetProfileParamsResponse`
* ***Status code***: `Bad Request`.
* **Posibles códigos de error**: `1603`.

### Errores comunes

* [`InternalServerErrorResponse`](#internalservererrorresponse): es un error inesperado del servidor que puede ocurrir luego de cualquier consulta a cualquier ruta.
* [`InvalidCredentialsResponse`](#invalidcredentialsresponse): ocurre cuando las credenciales del usuario son inválidas o no existen, en cualquier ruta que necesite de ellas.

### Códigos de error

| Nombre | Código |
|--------|--------|
InternalServerError | 1000 |
InvalidForm | 1200 |
InvalidHandle | 1301 |
InvalidEmail | 1302 |
InvalidPassword | 1303 |
InvalidFullName | 1304 |
InvalidBirthdate | 1305 |
InvalidContent | 1306 |
InvalidResponseTarget | 1307 |
InvalidQuoteTarget | 1308 |
InvalidGallery | 1309 |
UnavailableHandle | 1400 |
UnavailableEmail | 1401 |
InvalidCredentials | 1500 |
InvalidParams | 1600 |
InvalidUserIdParam | 1601 |
InvalidNextToParam | 1602 |
InvalidCheepIdParam | 1603 |
InvalidNameOrHandleParam | 1604 |
InvalidUserHandleParam | 1605 |
InvalidWordsParam | 1606 |
InvalidResponsesParam | 1607 |
InvalidOnlyGalleryParam | 1608 |
InvalidResponseOfParam | 1609 |
InvalidQuoteTargetParam | 1610 |
InvalidRecheepTargetParam | 1611 |
InvalidBirthdateParam | 1612 |
UserDoesNotExist | 1700 |
ProfileDoesNotExist | 1701 |
InsufficientPermissions | 1800 |
RecheepAlreadyExists | 1900 |
CheepDoesNotExist | 2000 |

### Referencia de objetos

#### `UserShortInformation`
```ts
{
    id: number,
    handle: string,
    name: string,
    picture: string,
}
```

#### `UserCellData`
```ts
{
    handle: string,
    name: string,
    picture: string,
    description: string,
    following: boolean,
    follower: boolean,
}
```

#### `SearchUserResult`
```ts
{
    users: Array<UserCellData>,
    next: number
}
```

#### `CheepData`
```ts
{
    id: number,
    author: UserShortInformation,
    dateCreated: number,
    content: string,
    gallery: Array<string>,
    quoteId: number,
    responseId: number,
    quoteTarget: CheepData,
    responseOf: CheepData,
    comments: number,
    likes: number,
    recheeps: number,
    quotes: number,
    userLikesIt: boolean,
    userRecheepedIt: boolean,
}
```

#### `SearchCheepsResult`
```ts
{
    cheeps: Array<CheepData>,
    next: number,
}
```

#### `ProfileData`
```ts
{
    handle: string,
    name: string,
    picture: string,
    banner: string,
    description: string,
    joinDate: number,
    birthdate: number,
    location: string,
    website: string,
    cheepCount: number,
    followingCount: number,
    followersCount: number,
    following: boolean,
}
```

### User API

La *User API* es la interfaz con la que se administran las operaciones sobre los usuarios.

#### GET `/api/user`
* **Descripción**: buscar usuarios.
* **Credenciales**: Sí.
* ***Query params***:
    ```ts
    {
        nameOrHandle: string,
        nextTo?: number,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`SearchUserResult`](#searchuserresult).

#### POST `/api/user`
* **Descripción**: crear un nuevo usuario.
* **Credenciales**: No.
* **Cuerpo de la consulta**:
    ```ts
    {
        handle: string,
        email: string,
        password: string,
        fullName: string,
        birthdate: number,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: Created.
    * **Cuerpo**: [`UserShortInformation`](#usershortinformation).
* **Errores**:
    * [`InvalidLoginFormResponse`](#invalidsignupformresponse): ocurre cuando el cuerpo de la consulta es inválido.
    * [`UnavailableHandleResponse`](#unavailablehandleresponse): ocurre cuando el *handle* enviado no está disponible para nuevos usuarios.
    * [`UnavailableEmailResponse`](#unavailableemailresponse): ocurre cuando el *email* enviado no está disponible para nuevos usuarios.

#### GET `/api/user/current`
* **Descripción**: solicitar la información sobre el usuario actual.
* **Credenciales**: Sí.
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`UserShortInformation`](#usershortinformation).

#### POST `/api/user/auth`
* **Descripción**: iniciar sesión.
* **Credenciales**: No.
* **Cuerpo de la consulta**:
    ```ts
    {
        handleOrEmail: string,
        password: string,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: `UserShortInformation`.
* **Errores**:
    * [`InvalidCredentialsResponse`](#invalidcredentialsresponse): ocurre cuando la combinación `handleOrEmail` - `password` no corresponse a ningún usuario registrado.

#### POST `/api/user/follow/:userHandle`
* **Descripción**: seguir a un usuario.
* **Credenciales**: Sí.
* **Respuesta exitosa**
    * ***Status code***: Created.
    * **Cuerpo**: `undefined`.

#### DELETE `/api/user/unfollow/:userHandle`
* **Descripción**: dejar de seguir a un usuario.
* **Credenciales**: Sí.
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: `undefined`.

#### GET `/api/user/follower-list`
* **Descripción**: solicitar la lista de usuarios que siguen a uno determinado.
* **Credenciales**: Sí.
* ***Query params***:
    ```ts
    {
        userHandle: string,
        nextTo?: number,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`UserSearchResult`](#searchuserresult).
* **Errores**:
    * [`InvalidFollowersListParamsResponse`](#invalidfollowerslistparamsresponse): ocurre cuando alguno de los parámetros de la *query* es inválido.

#### GET `/api/user/following-list`
* **Descripción**: solicitar la lista de usuarios a los que sigue uno determinado.
* **Credenciales**: Sí.
* ***Query params***:
    ```ts
    {
        userHandle: string,
        nextTo?: number,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`UserSearchResult`](#searchuserresult).
* **Errores**:
    * [`InvalidFollowersListParamsResponse`](#invalidfollowerslistparamsresponse): ocurre cuando alguno de los parámetros de la *query* es inválido.

#### GET `/api/user/recommended-list`
* **Descripción**: solicitar la lista de usuarios recomendados.
* **Credenciales**: Sí.
* ***Query params***:
    ```ts
    {
        nextTo?: number,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`UserSearchResult`](#searchuserresult).
* **Errores**:
    * [`InvalidRecommendedListParamsResponse`](#invalidrecommendedlistparamsresponse): ocurre cuando el parámetro `nextTo` de la query es inválido.

#### GET `/api/user/users-liked-list`
* **Descripción**: solicitar la lista de usuarios que le dieron *like* a un *cheep*.
* **Credenciales**: Sí.
* ***Query params***:
    ```ts
    {
        cheepId: number,
        nextTo?: number,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`UserSearchResult`](#searchuserresult).
* **Errores**:
    * [`InvalidUsersLikedListParamsResponse`](#invaliduserslikedlistparamsresponse): ocurre cuando alguno de los parámetros de la *query* es inválido.

#### GET `/api/user/users-recheeped-list`
* **Descripción**: solicitar la lista de usuarios que dieron *recheep* a un *cheep*.
* **Credenciales**: Sí.
* ***Query params***:
    ```ts
    {
        cheepId: number,
        nextTo?: number,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`UserSearchResult`](#searchuserresult).
* **Errores**:
    * [`InvalidUsersLikedListParamsResponse`](#invaliduserslikedlistparamsresponse): ocurre cuando alguno de los parámetros de la *query* es inválido.

### Cheep API

#### GET `/api/cheep`
* **Descripción**: buscar *cheeps*.
* **Credenciales**: Sí.
* ***Query params***:
    ```ts
    {
        words?: string,
        userHandle?: string,
        responses?: boolean,
        onlyGallery?: boolean,
        responseOf?: number,
        quoteTarget?: number,
        recheepTarget?: number,
        nextTo?: number,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`SearchCheepsResult`](#searchcheepsresult).
* **Errores**:
    * [`InvalidSearchCheepsParamsResponse`](#invalidsearchcheepsparamsresponse): ocurre cuando alguno de los parámetros de la *query* es inválido.

#### POST `/api/cheep`
* **Descripción**: crear un nuevo *cheep*.
* **Credenciales**: Sí.
* **Cuerpo de la consulta**:
    ```ts
    {
        responseTarget?: number,
        quoteTarget?: number,
        content?: string,
        gallery?: Array<string>,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: Created.
    * **Cuerpo**: [`CheepData`](#cheepdata).
* **Errores**:
    * [`InvalidCreateCheepFormResponse`](#invalidcreatecheepformresponse): ocurre cuando alguno de los parámetros en el cuerpo de la consulta es inválido.
    * [`RecheepAlreadyExistsResponse`](#recheepalreadyexistsresponse): ocurre cuando ya existe un *recheep* para ese mismo *cheep*.

#### GET `/api/cheep/liked-list`
* **Descripción**: solicitar la lista de *cheeps* a los que un cierto usuario les ha dado *like*.
* **Credenciales**: Sí.
* ***Query params***:
    ```ts
    {
        userHandle: string,
        nextTo?: number,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`SearchCheepsResult`](#searchcheepsresult).
* **Errores**:
    * [`InvalidLikedCheepsParamsResponse`](#invalidlikedcheepsparamsresponse): ocurre cuando alguno de los parámetros de la *query* es inválido.

#### GET `/api/cheep/timeline`
* **Descripción**: solicitar la lista de *cheeps* que forman parte del *timeline* del usuario.
* **Credenciales**: Sí.
* ***Query params***:
    ```ts
    {
        nextTo?: number,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`SearchCheepsResult`](#searchcheepsresult).
* **Errores**:
    * [`InvalidGetTimelineParamsResponse`](#invalidgettimelineparamsresponse): ocurre cuando alguno de los parámetros de la *query* es inválido.

#### GET `/api/cheep/explore`
* **Descripción**: solicitar la lista de *cheeps* en la categoría *'explore'*.
* **Credenciales**: Sí.
* ***Query params***:
    ```ts
    {
        nextTo?: number,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`SearchCheepsResult`](#searchcheepsresult).
* **Errores**:
    * [`InvalidExploreParamsResponse`](#invalidexploreparamsresponse): ocurre cuando alguno de los parámetros de la *query* es inválido.

#### POST `/api/cheep/like/:cheepId`
* **Descripción**: dar *like* a un *cheep*.
* **Credenciales**: Sí.
* **Respuesta exitosa**
    * ***Status code***: Created.
    * **Cuerpo**: `undefined`.
* **Errores**:
    * [`InvalidLikeParamsResponse`](#invalidlikeparamsresponse): ocurre cuando el parámetro `:cheepId` es inválido.

#### DELETE `/api/cheep/like/:cheepId`
* **Descripción**: deshacer el *like* a un *cheep*.
* **Credenciales**: Sí.
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: `undefined`.
* **Errores**:
    * [`InvalidLikeParamsResponse`](#invalidlikeparamsresponse): ocurre cuando el parámetro `:cheepId` es inválido.

#### DELETE `/api/cheep/recheep/:cheepId`
* **Descripción**: deshacer el *recheep* a un *cheep*.
* **Credenciales**: Sí.
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: `undefined`.
* **Errores**:
    * [`InvalidDeleteRecheepParamsResponse`](#invaliddeleterecheepparamsresponse): ocurre cuando el parámetro `:cheepId` es inválido.

#### GET `/api/cheep/:cheepId`
* **Descripción**: solicitar la información de un único *cheep*.
* **Credenciales**: Sí.
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`CheepData`](#cheepdata).
* **Errores**:
    * [`InvalidGetCheepParamsResponse`](#invalidgetcheepparamsresponse): ocurre cuando el parámetros `:cheepId` es inválido.
    * [`CheepNotFoundResponse`](#cheepnotfoundresponse): ocurre cuando el *chee* solicitado no existe.

#### DELETE `/api/cheep/:cheepId`
* **Descripción**: elimiar un *cheep*.
* **Credenciales**: Sí.
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: `undefined`.
* **Errores**:
    * [`InvalidDeleteCheepParamsResponse`](#invaliddeletecheepparamsresponse): ocurre cuando el parámetros `:cheepId` es inválido.

### Profile API

#### PATCH `/api/profile`
* **Descripción**: modificar los datos de perfil del usuario.
* **Credenciales**: Sí.
* **Cuerpo de la consulta**:
    ```ts
    {
        name?: string,
        picture?: string,
        banner?: string,
        description?: string,
        birthdate?: number,
        location?: string,
        website?: string,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`ProfileData`](#profiledata).
* **Errores**:
    * [`InvalidUpdateProfileFormResponse`](#invalidupdateprofileformresponse): ocurre cuando alguno de los parámetros del *body* es inválido.

#### GET `/api/profile/:userHandle`
* **Descripción**: solicitar la información del perfil de un usuario.
* **Credenciales**: Sí.
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**: [`ProfileData`](#profiledata).
* **Errores**:
    * [`InvalidGetProfileParamsResponse`](#invalidgetprofileparamsresponse): ocurre cuando el parámetro `:userHandle` es inválido.

### Upload API

#### POST `/api/upload/gallery`
* **Descripción**: cargar una imagen para publicarla en un *cheep*.
* **Credenciales**: Sí.
* **Cuerpo de la consulta**:
    ```ts
    {
        image: Buffer,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**:
        ```ts
        {
            imageUrl: string,
        }
        ```

#### POST `/api/upload/profile`
* **Descripción**: cargar una imagen para usarla como foto de perfil.
* **Credenciales**: Sí.
* **Cuerpo de la consulta**:
    ```ts
    {
        image: Buffer,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**:
        ```ts
        {
            imageUrl: string,
        }
        ```

#### POST `/api/upload/banner`
* **Descripción**: cargar una imagen para userla como foto de portada.
* **Credenciales**: Sí.
* **Cuerpo de la consulta**:
    ```ts
    {
        image: Buffer,
    }
    ```
* **Respuesta exitosa**
    * ***Status code***: OK.
    * **Cuerpo**:
        ```ts
        {
            imageUrl: string,
        }
        ```