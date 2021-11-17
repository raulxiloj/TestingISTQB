# Taller 2: Pruebas end to end (E2E)
Bienvenido al segundo taller en donde se realizaran pruebas end to end (E2E) con la herramienta Cypress a una aplicacion web desarollada en React. La aplicacion es una app de lista de tareas en la cual se puede ir cambiando los estados de estas mismas a completado, pausado y eliminar.

![image](https://user-images.githubusercontent.com/30850990/142194503-d39c4079-64a6-45bc-a3d5-3e1d7493759a.png)


## Descripcion
Dentro de la carpeta **Cypress** se tiene el codigo de una aplicacion de React junto a la configuracion de cypress. El punto de este taller es enseñar como simular hacer pruebas de un usuario final a una aplicacion y verificar que este funcionando de manera correcta.

## Instrucciones

## Paso 1. Instalar los modulos necesarios para correr la aplicacion
Ejecutar el siguiente comando:
```
npm install
```
Este comando nos creara una carpeta llamada `node_modules` en donde estaran todas las dependencias para poder correr el proyecto.

## Paso 2. Iniciar Cypress
Para verificar que la instalacion fue completada con exito se ejecutara el siguiente comando:
```
npm run cypress
```
- El cual se encuentra en el package.json 

![image](https://user-images.githubusercontent.com/30850990/142189021-2e6b0cf7-d62d-46ec-ad70-369968297053.png)

Y nos abrira la siguiente ventana:
![image](https://user-images.githubusercontent.com/30850990/142189124-0e9b4cd9-6c66-4764-a187-61795dc20753.png)
- En esta ventana aparecen pruebas predefinidas las cuales seran borradas para agregar las nuestras.

Al momento de instalar los modulos se instala cypress ya que esta como una dependencia y esta nos crea un directorio llamado `cypress` en la cual se encuentran 4 subdirectorios los cuales tienen la siguiente funcion:
- fixtures: En este directorio se pueden crear mocks para poder simular llamadas a una API.
- integration: En este directorio se escribiran todas las pruebas.
    - Cabe resaltar que al momento de ejecutar las pruebas se ejecutan en orden alfabetico. Por lo mismo en esta guia se seguira la convencion de tener el prefijo de un numero seguido de un guion bajo y el nombre (Ejemplo: `01_prueba.test.js`)
- plugins: En este directorio se agregan las librerias extras necesarias.
- support: En este directorio se pueden guardar comandos para ejecutar luego.

## Paso 3. Agregar pruebas

Como se menciono previamente en la carpeta `integration` es donde se agregaran las pruebas. Se crea el archivo `01_todo.test.js` y se agrega lo siguiente:

```js
context('Todos', () => {

    it('Agregar todos', () => {
        cy.visit(Cypress.env('baseUrl'));
        cy.clearLocalStorage();
        cy.get('[data-testid="todo"]').should('have.length',0);
    });

});
```
- **context** hace referencia a todo el entorno al cual se le va hacer pruebas
- **it** hace referencia a una prueba especifica, en este caso vamos a probar que se redirija a la pagina de inicio y existan 0 tareas.
- **cy.get** es para poder obtener cierto elemento y verificar ciertos atributos de este elemento.

Las cuales pasan con exito.

![image](https://user-images.githubusercontent.com/30850990/142196024-8eb6c459-9172-41da-bf55-b29fd8de92de.png)

Siempre es bueno hacer pruebas respecto a algo que falle (_recordar los principios TDD_) ya que si solo se prueba que funcione no se esta cerciorando si la prueba esta del todo bien o no. En este caso verificaremos que ya exista una tarea creada, lo cual no tendria que ser asi, ya que cuando se inicia tienen que haber cero tareas.
```js
cy.get('[data-testid="todo"]').should('have.length',1);
```

La prueba falla como se esperaba

![image](https://user-images.githubusercontent.com/30850990/142196515-292fd1fe-9d54-4677-9475-a33639d5ffbf.png)


Ya que se estara agregando la siguiente instruccion varias veces `cy.get('[data-testid="ID"]')` se decide agregar un comando para facilitar este proceso. Nos redirigimos a la carpeta `support` y al archivo `commands.js` y agregamos lo siguiente:
```js
Cypress.Commands.add('getByTestId', id => {
    cy.get(`[data-testid="${id}"]`)
});
```
- **add** es una funcion para crear un comando, el primer argumento es el nombre del comando y el segundo es la funcion como tal que ejecutara. 

Por consiguiente nuestra prueba anterior quedaria de la siguienta manera:
```js
it('Agregar todos', () => {
    cy.visit(Cypress.env('baseUrl'));
    cy.clearLocalStorage();
    cy.getByTestId('todo').should('have.length',0);
    cy.getByTestId('add-todo-input').type('Aprender Cypress!');
    cy.getByTestId('add-todo-button').click();
    cy.getByTestId('add-todo-input').type('Escribir pruebas.');
    cy.getByTestId('add-todo-button').click();
    cy.getByTestId('add-todo-input').type('Estudiar matematicas.');
    cy.getByTestId('add-todo-button').click();
    cy.getByTestId('todo').should('have.length',3);

    cy.getByTestId('todo').children().first().should('have.text','Aprender Cypress!');

    cy.getByTestId('pending-list').children().should('have.length',3)
    cy.getByTestId('paused-list').children().should('have.length',0)
    cy.getByTestId('completed-list').children().should('have.length',0)
});
```
- La prueba consiste en agregar tareas 
    - Para ello primero verificamos que no exista ninguna (porque es la primera vez que se ejecuta).
    - Luego agregamos 3 tareas
    - Verificamos que sea vea reflejado
    - Verificamos que las listas esten acorde a las acciones que se acaban de hacer las cuales son todas estan creadas por lo tanto estan pendientes.

![image](https://user-images.githubusercontent.com/30850990/142199194-cc92269f-63af-4e34-b3a3-3e581f9b277a.png)

Siguiendo esta logica se agregan mas pruebas sobre el listado de tareas como: 
- No permitir agregar tareas vacias
- Pausar tareas
- Despausar tareas
- Completar tareas 
- Eliminar tareas
- Resetear el estado de la aplicacion

_Estas tareas estan detalladas en el archivo `01_todo.test.js`._

Otro tipo de prueba que se podria agregar es el de la validacion de la informacion de la fecha. Se creo un archivo llamado `02_date.test.js`

Y se repitio el proceso anterior:

```js
context('Fecha', () => {
    it('Se muestra la informacion correcta acerca de la fecha', () => {
        cy.clock(new Date(1637154305355));
        cy.visit(Cypress.env('baseUrl'));
        
        cy.reload();
        
        cy.getByTestId('day').should('have.text', '17');
        cy.getByTestId('year').should('have.text', '2021');
        cy.getByTestId('month').should('have.text', 'Nov');
    });
});
```
- Se agrego el context que ahora es para la `Fecha`
- Se agrego un test en el `it` que es especificamente sobre la informacion que se esta mostrando sobre la fecha
    - Basicamente se ingresa una fecha y se corrobora que esta este correcta en base a lo que se muestra en cada componente que compone la fecha.

Este tipo de pruebas es bastante util ya que se puede simular una interaccion con un usuario y verificar que la aplicacion este funcionando correctamente. Desde llamadas a APIS, el contenido que se esta mostrando, la limpieza de datos, la ubicacion de componentes, entre otras.

El framework `**Cypres**` facilita mucho este trabajo ya que es bastante sencillo de aprender a implementar.  Y se adapta a varios frameworks.

