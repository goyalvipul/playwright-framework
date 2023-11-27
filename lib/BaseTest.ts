import { test as baseTest, expect, Page } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { WebActions } from '@lib/WebActions';
import { APIActions } from './APIActions';
import { Assertions } from '@lib/Assertions';
import { DataReader } from './DataReader';

/**
 * @author Vipul Goyal
 *
 * @HowToUse
 * 1. import test from '@lib/baseTest' --> this will pull all the undermentioned variables and create respective instances.
 * 2. test(`verify <something> test`, async ({ loginPage, dataReader }) => {}
 * values which can be used withing the {} in async function :- webActions, loginPage, interactionsPage, apiActions, assert, dataReader, testhook, page
 *
 */
const test = baseTest.extend<{
  webActions: WebActions;
  loginPage: LoginPage;
  request: APIActions;
  assert: Assertions;
  dataReader: DataReader;
  testhook: void;
  page: Page;
  failOnJSError: Boolean;
}>({
  webActions: async ({ page, context }, use) => {
    await use(new WebActions(page, context));
  },
  loginPage: async ({ page, context }, use) => {
    await use(new LoginPage(page, context));
  },
  request: async ({ page, context }, use) => {
    await use(new APIActions(page, context));
  },
  assert: async ({ page, context }, use) => {
    await use(new Assertions(page, context));
  },
  dataReader: async ({ page, context }, use) => {
    await use(new DataReader(page, context));
  },
  page: async ({ page }, use) => {
    const errorLogs: Array<String> = [];
    page.on('console', (message) => {
      if (message.type() == 'error') {
        errorLogs.push(message.text() + ' - ' + message.page().url());
      }
    });
    const errors: Array<Error> = [];
    page.addListener('pageerror', (error) => {
      errors.push(error);
    });
    await use(page);
    expect(errors).toHaveLength(0);
  },
  testhook: [
    async ({}, use) => {
      console.log(' ~~~~~ Test Case Started ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      await use();
      console.log(' ~~~~~ Test Case Ended ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    },
    { auto: true },
  ],
});

export default test;
export { expect } from '@playwright/test';
