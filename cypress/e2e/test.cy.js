describe('Run Playwright code with Cypress', () => {
  it('passes', () => {
    Cypress.on('uncaught:exception', () =>
    // I dont fix cypress website errors
    // eslint-disable-next-line implicit-arrow-linebreak
      false);

    cy.visit('https://example.cypress.io');

    async function playwrightCodeBlock(frame) {
      const locator = frame.locator('a:has-text("screenshot")');
      await locator.scrollIntoViewIfNeeded();
      await locator.click();
    }

    cy.task('runPlaywright', playwrightCodeBlock.toString());

    cy.url().should('contain', 'misc');
    cy.get('body').should('contain', 'cypress/screenshots/my-image.png');
    cy.get('body').contains('cy.focused()').click();
    cy.get('body').contains('Get the DOM element that is currently focused.').should('exist');
  });
});
