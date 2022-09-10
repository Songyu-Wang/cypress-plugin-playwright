# cypress-plugin-playwright

This Cypress plugin allows you to run playwright code within the cypress runner

This plugin does not assume your cypress and/or playwright versions. Install them separately

If you are using `cypress<10.0.0`, you will have to reverse migrate the below code,
see https://docs.cypress.io/guides/references/migration-guide#Migrating-to-Cypress-version-10-0

## Install

```
npm i cypress-plugin-playwright
```

```javascript
// cypress.config.js


import {defineConfig} from 'cypress';
import playwrightPlugin from "cypress-plugin-playwright/playwrightPlugin.js";

export default defineConfig({
    // ...
    e2e: {
        setupNodeEvents(on, config) {
            // ...
            playwrightPlugin(on, config);
            // ...
        },
        // ...
    },
    // ...
});
```

## Test Example

Below demonstrated a mixed it block with cypress and playwright.
If you are using this plugin seriously, you probably want to add a wrapper to the `cy.task()` to simplify the syntax

```javascript
// test.cy.js

describe('Run Playwright code with Cypress', () => {
    it('passes', () => {
        cy.visit('https://example.cypress.io');

        async function playwrightCodeBlock(frame) {
            const locator = frame.locator('a:has-text("screenshot")');
            await locator.scrollIntoViewIfNeeded();
            await locator.click();
        }

        // Unfortunately the `toString()` is needed
        cy.task('runPlaywright', playwrightCodeBlock.toString());

        cy.url().should('contain', 'misc');
        cy.get('body').should('contain', 'cypress/screenshots/my-image.png');
        cy.get('body').contains('cy.focused()').click();
        cy.get('body').contains('Get the DOM element that is currently focused.').should('exist');
    });
});
```
