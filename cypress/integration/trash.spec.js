describe('Trash Section', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/trash', { fixture: 'trashItems.json' }).as('getTrashItems');
        cy.visit('/trash');
    });

    it('displays trash items correctly', () => {
        cy.wait('@getTrashItems');

        // Check if images are displayed
        cy.get('[data-testid="image-gallery"]').should('exist');
        cy.get('[data-testid="image-card"]').should('have.length.at.least', 1);

        // Check if videos are displayed
        cy.get('[data-testid="video-gallery"]').should('exist');
        cy.get('[data-testid="video-card"]').should('have.length.at.least', 1);
    });

    it('restores items from trash', () => {
        cy.intercept('PATCH', '/api/trash/*/restore', { statusCode: 200 }).as('restoreItem');

        cy.get('[data-testid="restore-button"]').first().click();

        cy.wait('@restoreItem').its('response.statusCode').should('eq', 200);
        cy.get('[data-testid="success-message"]').should('be.visible');
    });

    it('permanently deletes items', () => {
        cy.intercept('DELETE', '/api/trash/*', { statusCode: 200 }).as('deleteItem');

        cy.get('[data-testid="delete-button"]').first().click();
        cy.get('[data-testid="confirm-delete"]').click();

        cy.wait('@deleteItem').its('response.statusCode').should('eq', 200);
        cy.get('[data-testid="success-message"]').should('be.visible');
    });
}); 