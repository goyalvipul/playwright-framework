import rimraf from 'rimraf';
import test from '@lib/BaseTest';
import defaultConfig from './playwright.config';
import { Page, Browser, Locator, expect, BrowserContext, chromium, request } from '@playwright/test';

async function globalSetup(): Promise<void> {
  await new Promise((resolve) => {
    rimraf(`./allure-results`, resolve);
  });
}

export default globalSetup;
