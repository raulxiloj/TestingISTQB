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