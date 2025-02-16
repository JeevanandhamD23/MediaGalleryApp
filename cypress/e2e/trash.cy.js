describe('Trash Page', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/trash', { fixture: 'trashItems.json' }).as('getTrashItems');
        cy.visit('/trash');
    });

    it('displays trash items', () => {
        cy.wait('@getTrashItems');
        cy.get('[data-testid=trash-items]').should('have.length.at.least', 1);
    });

    it('restores items from trash', () => {
        cy.intercept('PATCH', '/api/trash/*/restore', { statusCode: 200 }).as('restoreItem');

        cy.get('[data-testid=restore-button]').first().click();
        cy.wait('@restoreItem');
        cy.get('[data-testid=success-message]').should('be.visible');
    });

    it('permanently deletes items', () => {
        cy.intercept('DELETE', '/api/trash/*', { statusCode: 200 }).as('deleteItem');

        cy.get('[data-testid=delete-button]').first().click();
        cy.get('[data-testid=confirm-delete]').click();
        cy.wait('@deleteItem');
        cy.get('[data-testid=success-message]').should('be.visible');
    });
}); 