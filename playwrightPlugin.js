// eslint-disable-next-line import/no-extraneous-dependencies
import { chromium } from 'playwright';

export const MainFrame = (function () {
  async function getFrame(remoteDebuggingAddress, remoteDebuggingPort) {
    const browser = await chromium.connectOverCDP(`http://${remoteDebuggingAddress}:${remoteDebuggingPort}`);
    const context = browser.contexts()[0];
    const page = await context.pages()[0];
    return page.mainFrame();
  }

  let instance;
  return {
    async get(remoteDebuggingAddress, remoteDebuggingPort) {
      // Singleton to avoid slow connections
      if (instance == null) {
        instance = await getFrame(remoteDebuggingAddress, remoteDebuggingPort);
      }
      return instance;
    },
  };
}());
let remoteDebuggingPort;
let remoteDebuggingAddress;
export default function playwrightPlugin(on) {
  // eslint-disable-next-line default-param-last
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'chromium') {
      // Due to https://github.com/cypress-io/cypress/issues/21167, we have to make Playwright use whatever Cypress
      // chooses to use.
      launchOptions.args.forEach((arg) => {
        if (arg.includes('remote-debugging-port')) {
          // eslint-disable-next-line prefer-destructuring
          remoteDebuggingPort = arg.split('=')[1];
        }
        if (arg.includes('remote-debugging-address')) {
          // eslint-disable-next-line prefer-destructuring
          remoteDebuggingAddress = arg.split('=')[1];
        }
      });
    }
  });
  on('task', {
    async runPlaywright(codeBlock) {
      // codeBlock is a serialized function
      const mainFrame = await MainFrame.get(remoteDebuggingAddress, remoteDebuggingPort);
      // This cannot be singleton
      const testTargetFrame = mainFrame.childFrames()[0];
      // A function cannot be serialized from the test file as a task arg and get it run here.
      // So This is a hack
      // eslint-disable-next-line no-new-func
      new Function(`return ${codeBlock.toString()}`)()(testTargetFrame);
      return null;
    },
  });
}
