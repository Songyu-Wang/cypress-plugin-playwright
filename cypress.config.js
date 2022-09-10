// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress';
// eslint-disable-next-line import/extensions
import playwrightPlugin from './playwrightPlugin.js';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      playwrightPlugin(on, config);
    },
  },
});
