Feature: Pruebas en la navegacion entre paginas

Scenario: Desde la pagina Home se puede ir a la pagina Blog
    Given Estoy en la pagina Home
    When Cuando presione el boton 'Ingresar' con id "blog-link"
    Then Estoy en la pagina Blog