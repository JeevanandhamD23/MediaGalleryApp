// Custom command to upload a file
Cypress.Commands.add('uploadFile', (fileName, fileType = '', selector = 'input[type="file"]') => {
    cy.get(selector).then(subject => {
        cy.fixture(fileName, 'base64')
            .then(Cypress.Blob.base64StringToBlob)
            .then(blob => {
                const el = subject[0];
                const testFile = new File([blob], fileName, { type: fileType });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(testFile);
                el.files = dataTransfer.files;
                cy.wrap(subject).trigger('change', { force: true });
            });
    });
});

// Custom command to login
Cypress.Commands.add('login', (email, password) => {
    cy.session([email, password], () => {
        cy.visit('/login');
        cy.get('[data-testid=email-input]').type(email);
        cy.get('[data-testid=password-input]').type(password);
        cy.get('[data-testid=login-button]').click();
        cy.url().should('not.include', '/login');
    });
}); 