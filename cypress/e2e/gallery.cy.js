describe('Gallery Page', () => {
    beforeEach(() => {
        cy.intercept('GET', '/api/images*', { fixture: 'images.json' }).as('getImages');
        cy.intercept('GET', '/api/videos*', { fixture: 'videos.json' }).as('getVideos');
        cy.visit('/');
    });

    it('displays images and videos', () => {
        cy.wait(['@getImages', '@getVideos']);

        cy.get('[data-testid=image-gallery]').should('exist');
        cy.get('[data-testid=video-gallery]').should('exist');
        cy.get('[data-testid=media-card]').should('have.length.at.least', 1);
    });

    it('uploads an image', () => {
        cy.intercept('POST', '/api/images', { statusCode: 201 }).as('uploadImage');

        cy.get('[data-testid=upload-button]').click();
        cy.uploadFile('test-image.jpg', 'image/jpeg');
        cy.get('[data-testid=upload-submit]').click();

        cy.wait('@uploadImage');
        cy.get('[data-testid=success-message]').should('be.visible');
    });

    it('filters media by type', () => {
        cy.wait(['@getImages', '@getVideos']);

        cy.get('[data-testid=filter-images]').click();
        cy.get('[data-testid=video-gallery]').should('not.exist');
        cy.get('[data-testid=image-gallery]').should('exist');

        cy.get('[data-testid=filter-videos]').click();
        cy.get('[data-testid=image-gallery]').should('not.exist');
        cy.get('[data-testid=video-gallery]').should('exist');
    });
}); 