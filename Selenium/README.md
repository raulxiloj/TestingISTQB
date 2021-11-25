# Taller 3: Pruebas de aceptacion con Selenium
Bienvenidos al ultimo taller en donde se realizaran pruebas de aceptacion a una aplicacion web desarrollada en python.

## Requisitos
Tener conocimiento basico sobre python y flask.

## Descripcion
Una prueba de aceptacion es de las ultimas que se realizan en un desarrollo de software para determinar si se cumplen con los requerimientos solicitados o no. Aunque estas pruebas son definidas por el cliente y aprobadas por el mismo, existe software que nos ayuda a hacer pruebas fingiendo que nosotros somos usuarios finales (clientes) del software. 

Este tipo de pruebas deberian de ser aprobadas y definidas por el cliente, no que el cliente haga el codigo pero si que digan que es lo que se espera de una prueba realizada.

Cuando un cliente solicita algo por lo general lo dice de la siguiente manera _`Cuando haga algo quiero que esto pase.`_ por ejemplo:
- `Cuando presione este boton quiero redirigirme a la siguiente pagina.`

Pero el ejemplo queda muy ambiguo y confuso, uno como desarrollador tiene que preguntar _`desde que pagina se encuentra`_, _`a que boton se refiere`_, `a que pagina quiere redirigirse`, por ejemplo:
1. Me encuentro en la `pagina principal`.
2. Cuando presione el boton `Crear tarea`.
3. Ahora me encuentro en la pagina `Nueva tarea`.

Y esto se puede escribir de una manera un poco diferente y es siguiendo el **`Desarrollo guiado por el comportamiento (BDD Behaviour driven development)`** es un proceso de desarrollo de software que sirgio a partir del _`desarrollo guiado por pruebas (TDD Test driven development)`_ este desarrollo tiene 3 palabras claves **`Dado`** (requerimiento), **`Cuando`** (acciones) y **`Entonces`** (afirmaciones).

 - `Dado` que estoy en la pagina principal.
 - `Cuando` presione el boton 'Crear tarea'
 - `Entonces` voy a redirigirme a la pagina 'Nueva Tarea'

Siguiendo la metodologia del primer taller, se tienen 2 carpetas una llamada `plantilla` y otra llamada `final`. La carpeta plantilla es el codigo inicial con el fin de que lo tomen y puedan hacer el taller desde ese punto. La carpeta final tiene el resultado final que a continuacion se detallara. 

En la carpeta plantilla se encuentran los siguientes directorios y archivos:
- templates: Directorio que contiene el html para las paginas que se muestran al usuario.
- app.py: Archivo que contiene el servidor desarrollado con `Flask`
- requirements.txt: archivo generado en el cual se guardan todas las dependencias instaladas.

## Instrucciones

## Paso 1. Dirigirse al directorio Selenium
Una  vez clonado el repositorio, ingresaremos a la carpeta `Selenium`
```
cd Selenium
```

## Paso 2. Crear un entorno virtual con python
Es recomendable trabajar con un entorno virtual siempre que se trabaja con python para que las depedencias no se instalen a nivel global sino por proyecto. Siguiendo este estandar ejecutaremos los siguientes comandos dentro de la carpeta `plantilla`.

Primero se tiene que tener instalada la dependencia `virtualenv` para poder crear un entorno virtual.
```
pip install virtualenv
```

Luego se crea un entorno de la siguiente manera:
```
virtualenv venv
```
- Este comando creara una carpeta llamada `venv` en el directorio en el cual nos encontremos. Cuando instalemos alguna depedencia los archivos se redirigiran a este entorno virtual para tenerlo aislado para este proyecto.

Y por ultimo se activa para que lo que instalemos se redirija al proyecto local y no global. 
```
\venv\Scripts\activate.bat
```

## Paso 3. Instalar las depedendencias del proyecto
Ya que se esta trabajando con Python se usara el gestor de paquetes del mismo conocido como `pip` para poder instalar estas dependencias. 
```
pip install -r requirements.txt
```

## Paso 4. Verificacion de la instalacion
Para verificar si la instalacion fue correcta se verificara que el servidor funcione si ejecutamos el siguiente comando:
```
python app.py
```
El cual nos mostrara lo siguiente

![image](https://user-images.githubusercontent.com/30850990/143394240-c8037ead-6fda-4ebb-a6f6-1749a9f6d014.png)
- Indicando que el servidor esta corriendo en el puerto 5000.

Si nos redirigimos a `http://localhost:5000/` en el navegador nos mostrara la siguiente pagina:

![image](https://user-images.githubusercontent.com/30850990/143403247-069c007e-da36-49be-8fb1-62724fc74145.png)



## Paso 5. Creacion de pruebas

Se crea una carpeta llamada `tests` y dentro de ella una carpeta llamada `acceptance` haciendo referencia a las pruebas de aceptacion. 
Luego crearemos un archivo llamado `navigation.feature` ya que lo primero que se probara sera la navegacion entre paginas. Como se menciono previamente se seguira el desarrollo basado por comportamiento (BDD) en el cual definimos `Dado`, `Cuando` y `Entonces`.  Y en este tipo de archivo se puede definir de esa manera, solo que es en ingles `Given`, `When` y `Then`.

```feature
Feature: Pruebas en la navegacion entre paginas

Scenario: Desde la pagina Home se puede ir a la pagina Blog
    Given Estoy en la pagina Home
    When Cuando presione el boton 'Ingresar' con id "blog-link"
    Then Estoy en la pagina Blog
```

- Esta sintaxis es muy amigable hacia un usuario final.

Pero hasta aqui solo se tiene definido que es lo que se espera de la prueba, sin embargo falta escribir el codigo que lo haga.  Para ello crearemos una carpeta llamada `steps` y en ella agregaremos los archivos por cada `_.feature`, en este caso los primero serian `interactions.py` y `navigation.py`.

navigation.py
```py
from behave import * 
from selenium import webdriver

use_step_matcher('re')

@given('Estoy en la pagina Home')
def step_impl(context):
    context.browser = webdriver.Chrome('C:\\chromedriver.exe')
    context.browser.get('http://127.0.0.1:5000')


@then('Estoy en la pagina Blog')
def step_impl(context):
    expected_url = 'http://127.0.0.1:5000/blog'
    assert context.browser.current_url == expected_url 
')
```

interactions.py
```py
from behave import * 
from selenium import webdriver

use_step_matcher('re')

@when('Cuando presione el boton "Ingresar" con id "blog-link"')
def step_impl(context):
    link = context.browser.find_element_by_id('blog-link')
    link.click()
```

Y de esa manera tenemos la primera prueba, el `Dado`(given) una situacion, `Cuando`(when) y `Entonces`(then).

## 6. Ejecucion de prueba.
Para ejecutar las pruebas en el entorno virtual
```
.\venv\Scripts\behave.exe .\tests\acceptance
```

Salida esperada:
![image](https://user-images.githubusercontent.com/30850990/143431969-89641ffc-9a39-4b76-b63b-02a56c1f8f2f.png)