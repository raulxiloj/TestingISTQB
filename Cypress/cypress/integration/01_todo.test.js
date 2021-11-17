/// <reference types="Cypress" />

context('Todos - Tareas', () => {

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

    it('No se permiten agregar tareas vacias', () => {
        //Deberian de existir 3 tareas
        cy.getByTestId('todo').should('have.length',3);
        cy.getByTestId('add-todo-button').click();

        //Dberian de seguir existiendo solo 3 tareas
        cy.getByTestId('todo').should('have.length',3);
    });

    it('Se pueden pausar las tareas', () => {
        // El acordion no deberia de existir porque no hay ninguna tarea pausada de momento
        cy.contains('Hacer mas tarde').should('not.exist');
    
        cy.getByTestId('pause-button').eq(1).click();
    
        // Ahora si deberia de ser visible
        cy.contains('Hacer mas tarde').should('exist');
    
        // Verificar la lista de acordiones
        cy.getByTestId('pending-list').children().should('have.length', 2);
        cy.getByTestId('paused-list').children().should('have.length', 1);
        cy.getByTestId('completed-list').children().should('have.length', 0);
      });

    it('Despausar tareas (regresar a pendientes)', () => {
        cy.contains('Hacer mas tarde').should('exist').click();
    
        cy.getByTestId('resume-button').click();
    
        cy.contains('Do Later').should('not.exist');

        cy.getByTestId('pending-list').children().should('have.length', 3);
        cy.getByTestId('paused-list').children().should('have.length', 0);
        cy.getByTestId('completed-list').children().should('have.length', 0);
    });

    it('Completar tareas', () => {
        cy.contains('Completed').should('not.exist');
    
        cy.getByTestId('complete-button').eq(2).click();
    
        cy.contains('Completado').should('exist');
    
        cy.getByTestId('pending-list').children().should('have.length', 2);
        cy.getByTestId('paused-list').children().should('have.length', 0);
        cy.getByTestId('completed-list').children().should('have.length', 1);
    });

    it('Eliminar tareas', () => {
        cy.contains('Estudiar matematicas.').should('exist');
        cy.getByTestId('delete-button').eq(2).click();
        cy.contains('Estudiar matematicas.').should('not.exist');
    
        cy.getByTestId('pending-list').children().should('have.length', 2);
        cy.getByTestId('paused-list').children().should('have.length', 0);
        cy.getByTestId('completed-list').children().should('have.length', 0);
    });

    it('Permitir a los usuarios poder hacer el reset de las tareas', () => {
        // Reglas:
        // 1. Las tareas pausadas se mueven a pendientess will move to Pending
        // 2. Las completadas se eliminan
        // 3. Las pendientes no hacen se mueven
    
        // El buton de reset no deberia de ser visible a menos de que se complete una tarea
        cy.getByTestId('reset-button').should('not.exist');
    
        // Agregamos una nueva tarea
        cy.getByTestId('add-todo-input').type('Probando el boton de reset');
        cy.getByTestId('add-todo-button').click();
    
        // Todas deberian de estar pendientes
        cy.getByTestId('pending-list').children().should('have.length', 3);
        cy.getByTestId('paused-list').children().should('have.length', 0);
        cy.getByTestId('completed-list').children().should('have.length', 0);
    
        cy.getByTestId('complete-button').eq(1).click();
        cy.getByTestId('pause-button').eq(1).click();
    
        cy.getByTestId('pending-list').children().should('have.length', 1);
        cy.getByTestId('paused-list').children().should('have.length', 1);
        cy.getByTestId('completed-list').children().should('have.length', 1);
    
        // Se presiona el boton de reset
        cy.getByTestId('reset-button').should('exist').click();
    
        //Se verifican las listas 
        cy.getByTestId('pending-list').children().should('have.length', 2);
        cy.getByTestId('paused-list').children().should('have.length', 0);
        cy.getByTestId('completed-list').children().should('have.length', 0);
    });

});