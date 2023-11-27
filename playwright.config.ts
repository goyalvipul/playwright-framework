import { PlaywrightTestConfig, devices } from '@playwright/test';
import { config } from './utils/config/config';
require('dotenv').config();

const ENV = process.env.ENV || 'qa';

if (!ENV || ![`qa`, `dev`, `staging`, `prod`].includes(ENV)) {
  console.log('---ENV----' + ENV);
  console.log(`Please provide a correct environment value like "npx cross-env ENV=qa|dev|qaApi|devApi"`);
  process.exit();
}

const defaultConfig: PlaywrightTestConfig = {
  globalSetup: `./global-setup`,
  //globalTeardown: `./global-teardown`,
  timeout: 60000,
  retries: 0,
  use: {
    baseURL: config.base_url,
    headless: false,
    viewport: { width: 1500, height: 730 },
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    screenshot: 'on',
    video: `retain-on-failure`,
    trace: `off`,
    launchOptions: {
      slowMo: 0,
    },
  },

  reporter: [
    ['line'],
    [`./CustomReporter.ts`],
    [
      'allure-playwright',
      {
        detail: false,
        outputFolder: 'allure-results',
        suiteTitle: true,
        host: true,
        printSteps: true,
        categories: [
          {
            name: 'Outdated tests',
            messageRegex: '.*FileNotFound.*',
          },
        ],
        environmentInfo: {
          framework: 'playwright',
        },
      },
    ],
    [`html`, { outputFolder: 'html-report', open: 'never' }],
    [`junit`, { outputFile: 'test-results/junit-report.xml', embedAnnotationsAsProperties: true, attachmentsBaseURL: true, printSteps: true }],
  ],

  projects: [
    {
      name: `Chrome`,
      use: {
        browserName: `chromium`,
        channel: `chrome`,
      },
    },
    {
      name: `Chromium`,
      use: {
        browserName: `chromium`,
      },
    },

    {
      name: `Firefox`,
      use: {
        browserName: `firefox`,
        ignoreHTTPSErrors: true,
      },
    },

    {
      name: `Edge`,
      use: {
        browserName: `chromium`,
        channel: `msedge`,
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: `Safari`,
      use: {
        browserName: `webkit`,
      },
    },
    {
      name: `Device`,
      use: {
        ...devices[`Pixel 4a (5G)`],
        browserName: `chromium`,
        channel: `chrome`,
      },
    },
    {
      name: `DB`,
    },
    {
      name: `API`,
      use: {
        baseURL: config.base_url, //testConfig[ENV],
      },
    },
  ],
};
export default defaultConfig;
