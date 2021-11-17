# Taller 1: Pruebas unitarias en una API
Bienvenido al primer taller en donde se realizaran pruebas a una API desarrollada en nodejs.

## Requisitos
Tener conocimiento basico sobre nodejs y mongo que sera la base de datos que se estara utilizando.

## Descripcion
Dentro de la carpeta **Jest** se tienen dos carpetas una con el nombre *plantilla* la cual contiene el inicio del proyecto de la API para que se pueda usar de manera inicial. Por otro lado esta la carpeta *resultado* la cual es a lo que queremos llegar luego de finalizar este taller. 

En la carpeta *plantilla* se tiene el inicio de una API realizada en nodejs, por lo general cuando se desarrolla en nodejs se tiene la costumbre de colocar gran parte del codigo en el archivo index.js de la siguiente manera:
```js
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://sa-user:sa1234@cluster0.l395j.mongodb.net/sa-proyecto?retryWrites=true&w=majority');
        console.log('Connected to MongoDB');
    }catch(err) {
        console.log('ERROR: '+err)
    }
    
    app.listen(3000, () => {
        console.log('Listening on port 3000')
    });
}

start();
```

Pero a la hora de hacer pruebas de software siguiendo esa estructura las pruebas se complican por lo que se tiene la siguiente estructura de separarlo en dos archivos:
- app.js
    ```js
    const express = require('express');

    const app = express();

    app.use(express.json());

    module.exports = app;
    ```

- index.js
    ```js
    const app = require('./src/app');

    const mongoose = require('mongoose');

    const start = async () => {

        try {
            await mongoose.connect('mongodb+srv://sa-user:sa1234@cluster0.l395j.mongodb.net/tesis?retryWrites=true&w=majority');
            console.log('Connected to MongoDB');
        }catch(err) {
            console.log('ERROR: '+err)
        }

        app.listen(3000, () => {
            console.log('Listening on port 3000')
        });
    }

    start();
    ```

Y de esta manera poder acceder a la variable **app** de manera facil desde varios lugares (en los tests). *Recordar que nodejs es `singleton` por lo que cada vez que se hace un `require` hacia cierta dependencia o archivo, solo se hace una vez y luego se utiliza globalmente la primera vez que se haya solicitado.*

## Instrucciones

## Paso 1. Dirigirse al directorio plantilla
Una vez clonado el repositorio, ingresamos a la carpeta `Jest/plantilla`
```
cd Jest/plantilla
```

## Paso 2. Instalar los modulos necesarios para correr la API
Correr el siguiente comando:
```
npm install
```
Este comando nos creara una carpeta llamada `node_modules` en donde estaran todas las dependencias para poder correr el proyecto.

## Paso 3. Iniciar la API
Dado que se esta trabajando con nodejs se tiene un archivo de configuraciones donde se guardan las dependencias del proyecto y ciertos `scripts` para poder ejecutar comandos dentro del proyecto. 

Es por eso que cuando se corrio el comando anterior el proyecto sabia que dependencias y que versiones deberian de instalarse. Entre los comandos agregados esta el siguiente: 
```json
"dev": "nodemon index.js"
```
El cual es encargado de inicializar la API en modo desarrollo y facilita ver los cambios que hagamos cada vez que guardemos un archivo.

Para poder ejecutar el script debemos de correr el siguiente comando en alguna terminal ubicados en la carpeta correspondiente
```
npm run dev
```

Luego de correrlo, deberian de poder ver algo similar a lo siguiente:

![image](https://user-images.githubusercontent.com/30850990/141777192-a536ee36-5a6f-4466-ab58-81caff7d284d.png)

## Paso 4. Instalacion de dependencias para hacer los test

Las librerias que se utilizara para hacer las pruebas son las siguientes:
- [jest](https://www.npmjs.com/package/jest) libreria principal para hacer testing con javascript.
- [supertest](https://www.npmjs.com/package/supertest) paquete para hacer pruebas http de manera mas facil.
- [mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server) una replica de una base de datos en memoria de mongo.

El comando que debemos de correr para hacer la instalacion es el siguiente:
```
npm install --save-dev jest supertest mongodb-memory-server
```
Se agrega el parametro `--save-dev` ya que son dependencias de desarrollo y no de la aplicacion final.

## Paso 5. Configuracion del entorno

### Paso 5.1 Agregar script necesario en el package.json 
Se agrega el siguiente script:
```
"test": "jest --watchAll"
```
- El cual sirve para poder correr todos los test de nuestro proyecto.

Por otro lado agregamos tambien la configuracion necesario de jest
```
"jest": {
    "testEnvironment": "node",
    "setupFilesAfterEnv":[
      "./src/test/setup.js"
    ]
}
```

Y nuestro archivo `package.json` deberia de verse asi:

![image](https://user-images.githubusercontent.com/30850990/141773721-0cc36473-5f1f-46f6-b4bf-0180fcf9fcc8.png)


## Paso 5.2 Creacion del archivo de configuracion

- En la carpeta `src` se crea una carpeta llamada `test` y en esta carpeta creamos un archivo llamado `setup.js` el cual contendra lo siguiente:

```js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../app');

let mongo;
beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    } 
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});
```
- El metodo `beforeAll` se ejecutara antes de que se corran todos los test. En este metodo nos conectamos a la base de datos en memoria.
- El metodo `beforeEach` se ejecutara cada vez que se corra un test. En este metodo limpiamos las colecciones existentes.
- El metodo `afterAll` se ejecutara cada vez que se terminene de correr los test. En este metodo cerramos la conexion con la base de datos ya que se finalizaron los test.

## Paso 6. Definicion de rutas
Para todo servidor se tiene que saber cual es su proposito, transmitir informacion para cierto algun frontend, registrar usuarios en una base de datos, autenticar, entre otras cosas. La api que haremos sera sencilla pero el ejemplo aplica a otros desarrollos complejos.

Nuestra API guardara usuarios en una base de datos de Mongo utilizando mongo Atlas para tener el host de esta base de datos y devolvera informacion acerca de ellos. 

Para registrar un usuario usaremos el siguiente endpoint:

- **URL**:   `/api/users/registro`
- **Metodo**: `POST`
- **Cuerpo del endpoint**:
    ```
    {
        nombre: "Raul Xiloj",
        correo: "raul@gmail.com",
        password: 123456
    }
    ```
- **Respuesta exitosa**: 
    - Codigo 200
- **Respuesta con error**: 
    - Codigo 400

## Paso 7. TDD 
Antes de crear la ruta como tal, se seguira el estandar TDD (Test Driven Development) el cual indica hacer pruebas primero antes de la implementacion como tal.

<p align=center>
<img src="https://user-images.githubusercontent.com/30850990/142148402-4c763e77-4674-4ba7-96b8-b10306fef1aa.png" height="180" >
</p>

Crearemos una carpeta `routes` en el directorio `src`.  Y en ella crearemos otra carpeta con el nombre `__test__` y aqui es donde escribiremos todas nuestras pruebas.

El primer archivo que crearemos sera para hacer las pruebas de un registro de usuario, al cual nombraremos `signup.test.js`

**NOTA**
- _Todos los archivos que son de pruebas tienen que terminar con `.test.js` ya que a la hora de correr las pruebas, la herramienta `Jest` se encarga de buscar estos archivos y ejecutar las pruebas._


## **¿A que le hago prueba?, ¿Que tengo que probar?**
Uno de los objetivos de las pruebas es verificar que cierta caracteristica o requerimiento esta funcionando de manera correcta como se solicito. Desde la entrada hasta la salida, entonces dependera del software que se esta creando.

Ejemplos:
- Se necesita que exista un endpoint de tipo `POST` en la siguiente ruta `/api/users/registro`
- El cuerpo de la peticion debe de tener un `nombre`, un `correo` y una `contrasena`
- La peticion tiene que devolver un `codigo 201` si se registro correctamente
- La peticion tiene que devolver un `codigo 400` si el registro fallo
- No se deben permitir `correos duplicados`
- La contrasena debe de tener un `minimo de 6 caracteres`.
- Entre otras...

Siguiendo el desarrollo guiado por pruebas (TDD) procedemos a crear las pruebas de software.

```js
const request = require('supertest');
const app = require('../../app');

it('Existe una ruta /api/users/signup de tipo POST', async () => {
    return request(app).
        post('/api/users/registro')
        .expect([201,400]);
}); 
```
Para correr las pruebas se ejecuta el siguiente comando
```
npm run test
```

Al inicio la prueba deberia de fallar ya que la funcionalidad no existe

![image](https://user-images.githubusercontent.com/30850990/142156454-418d3c7f-8f92-4d3a-9fd2-b84fa3ac35d3.png)

Se procede a realizar el desarrollo para que funcione y por consiguiente que la prueba pase.

![image](https://user-images.githubusercontent.com/30850990/142162386-1eae080c-5887-4d28-a051-a12ab21a8475.png)

Se procede a continuar con las pruebas de los demas requerimientos y luego el desarrollo.

Pruebas desarrolladas
```js
it('Retorna un codigo 400 si no se le envian los parametros', async () => {
    const response = await request(app).post('/api/users/registro');
    expect(response.status).toEqual(400, {msg: 'No se reciben los parametros'});
}); 

it('Retorna un codigo 201 si se registra de manera exitosa', async () => {
    return request(app)
    .post('/api/users/registro')
    .send({
        nombre: 'Raul Xiloj',
        correo: 'raul@gmail.com',
        password: '123456'
    })
    .expect(201,{ msg: 'Usuario registrado con exito'});
});

it('No se permiten una contrasena de menos de 6 caracteres', async () => {
    return request(app)
    .post('/api/users/registro')
    .send({
        nombre: 'Raul Xiloj',
        correo: 'raul@gmail.com',
        password: '12345'
    })
    .expect(400,{msg: 'La contrasena debe de ser de 6 caracteres minimo'});
});

it('Retorna un codigo 400 si se trata de registrar un correo ya existente', async () => {
    await request(app)
    .post('/api/users/registro')
    .send({
        nombre: 'Raul Xiloj',
        correo: 'raul@gmail.com',
        password: '123456'
    })
    .expect(201);

    await request(app)
    .post('/api/users/registro')
    .send({
        nombre: 'Raul Xiloj',
        correo: 'raul@gmail.com',
        password: '123456'
    })
    .expect(400,{msg: 'Ya existe un usuario con ese correo'});
})
```

Implementacion:
Se crea un archivo en la carpeta `routes` llamado `registro.js`
```js
const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/api/users/registro', async (req, res) => {

    if (!req.body.nombre || !req.body.correo || !req.body.password) {
        return res.status(400).json({msg: 'No se reciben los parametros'})
    }

    if (req.body.password.length < 6) {
        return res.status(400).json({msg: 'La contrasena debe de ser de 6 caracteres minimo'})
    } 

    const { correo } = req.body;

    const existingUser = await User.findOne({ correo  })

    if (existingUser)
        return res.status(400).json({msg: 'Ya existe un usuario con ese correo'})
    

    const user = new User(req.body);

    await user.save();

    res.status(201).json({
        msg: 'Usuario registrado con exito'
    });

});

module.exports = { registroRouter: router };
```

Se corren las pruebas con el comando ya mencionado (`npm run test`)

![image](https://user-images.githubusercontent.com/30850990/142170429-b4311b4a-1bad-430c-b6b6-f694595c989d.png)


Que pasaria si un desarrollador del equipo cambia el mensaje de respuesta de algun error o del registro con exito, este daria error y se tendria que proceder a verificar si se puede hacer el cambio.

Ejemplo:
- Actualmente se tiene el requerimiento de que la contrasena sea de minimo 6 caracteres, que pasaria si se pasa a tener un minimo de 8?

![image](https://user-images.githubusercontent.com/30850990/142171369-a793ff3b-2694-436d-be18-ae83bc3902de.png)

- Este cambio hizo fallar dos pruebas, ya que ambas dependen de ese requerimiento y es algo comun que hacer un cambio rapido arruine algo mas que ya esta funcionando. Por eso se tiene que analizar la solucion para corroborar que no afecte algo mas. 

## Paso 8. Coverage  

Actualmente se tiene un registro de los tests que se estan ejecutando de manera correcta. Hay un reporte que sirve bastante el cual es el de cobertura, saber cuanto porcentaje de codigo se esta cubriendo en base a las pruebas que se estan desarrollando y la herramienta Jest lo proporciona de manera facil. 

Se agrega el siguiente comando a un script de node
```
"test:coverage": "jest --watchAll --no-cache --coverage"
```

Y para ejecutarlo se usa el siguiente comando:
```
npm run test:coverage
```

El cual nos brinda el reporte mencionado tanto en consola como en una pagina html.

![image](https://user-images.githubusercontent.com/30850990/142172762-12ccd4f6-eee3-43dc-b5ca-f414270f9122.png)

Para poder ver el reporte en html, se accede a una carpeta que se creo ejecuta el comando anterior la cual es la siguiente

![image](https://user-images.githubusercontent.com/30850990/142172933-e04fad58-3d00-427b-9cd1-81f1f8731c63.png)
- Se busca el archivo `index.html`

El cual nos muestra el siguiente reporte: 

![image](https://user-images.githubusercontent.com/30850990/142173157-3a165365-9d6a-4404-92f1-26a9d2bf2fcb.png)


![image](https://user-images.githubusercontent.com/30850990/142173424-939dc35e-0b2f-44aa-b3f9-63576fd4030f.png)

- Como se puede observar tanto en el reporte por consola o el de html, se cubrio el 100% de los archivos y lineas. Ya que se valido todo lo implementado pero recordar la manera en que se hizo **Primero hacer la prueba y luego el desarrollo**

**Cabe resaltar que el implementar pruebas no indica que no puedan existir defectos o errores en el desarrollo pero busca reducir esa cantidad de posibles errores.**