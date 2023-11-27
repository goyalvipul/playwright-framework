import { Page, BrowserContext, Locator, expect } from '@playwright/test';
import { WebActions } from '@lib/WebActions';
import { APIActions } from '@lib/APIActions';
import { DataReader } from '@lib/DataReader';
import { Assertions } from '@lib/Assertions';

let webActions: WebActions;
let apiActions: APIActions;
let utils: DataReader;
let assert: Assertions;

export class LoginPage {
  readonly page: Page;
  readonly context: BrowserContext;
  readonly profile_icon = '#headlessui-popover-button-1 svg';
  readonly login_button = "[data-testid='submit-button']";
  readonly email_editbox = '#email';
  readonly password_editbox = '#password';
  readonly logout_button = 'Log out';
  readonly loginErrorMessage_text = '#submit-login .text-left';
  readonly systemErrorMessage_text = "#submit-login [role='alert'] svg+div";

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    webActions = new WebActions(this.page, this.context);
    apiActions = new APIActions(this.page, this.context);
    utils = new DataReader(this.page, this.context);
    assert = new Assertions(this.page, this.context);
  }

  async navigateToURL(url = '/'): Promise<void> {
    await this.page.goto(url);
  }

  async clickPersonalLoginIcon(): Promise<void> {
    await webActions.clickByLocator(this.profile_icon);
  }

  /**
   *  Function helps to login into the application using UI Flow.
   * @param {string} username - Provide the Header name from the CSV File for the username.
   * @description Example:
   * <br> admin_email - For Admin Username,
   * <br> buyer_email - Buyer Username
   * <br> finance_email - Finance Username
   * @param {string} password - Provide the Header name from the CSV File for the passoword.
   * @description Example:
   * <br> admin_password - For Admin Password,
   * <br> buyer_password - Buyer Password
   * <br> finance_email - Finance Username
   * @param {boolean} isDataNeedToBeRead - helps to enable the function to read the login data sheet
   * @description Example:
   * <br> false - if you are providing login details from outside the function
   * <br> true - if you want the function to read the data for you.
   * @param {boolean} dataSheetName - Name of the sheet which needs to be read.
   *
   */
  async loginToApplicationUI(username, password, isDataNeedToBeRead: boolean = true, dataSheetName: string = 'login-data'): Promise<void> {
    let data;
    if (isDataNeedToBeRead) {
      data = await utils.getDataFromCSV(dataSheetName);
      await webActions.fillTextByLocator(this.email_editbox, data[0][username]);
      await webActions.fillTextByLocator(this.password_editbox, data[0][password]);
    } else {
      await webActions.fillTextByLocator(this.email_editbox, username);
      await webActions.fillTextByLocator(this.password_editbox, password);
    }
    await webActions.clickByLocator(this.login_button);
  }

  async logoutApplication(): Promise<void> {
    await this.navigateToURL('/account');
    await webActions.clickByText(this.logout_button);
  }

  /**
   * THIS IS NOT FUNCTIONAL YET. WILL BE WORKING WHEN APIGII IMPLEMENTATION IS DONE
   */
  async loginToApplicationUsingAPI(): Promise<void> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = "{'email': `${process.env.FRONTASTIC_USERNAME}, 'password': `${process.env.FRONTASTIC_PASSWORD}`}";
    apiActions.api('https://b2bcofedev001-lululemon.frontastic.io/frontastic/action/account/login', 'POST', headers, body, true);
  }

  async verifyUserIsLoggedIn(): Promise<void> {
    await webActions.clickByLocator("[data-testid='name']");
    await assert.toBeVisible("[data-testid='name']");
  }

  async verifyLoginError(userFieldError, passwordFieldError, genericError): Promise<void> {
    if (userFieldError != 'NA') {
      await assert.toContainTextByMultipleElementLocator(this.loginErrorMessage_text, userFieldError);
    }
    if (passwordFieldError != 'NA') {
      await assert.toContainTextByMultipleElementLocator(this.loginErrorMessage_text, passwordFieldError);
    }
    if (genericError != 'NA') {
      await assert.toContainTextByMultipleElementLocator(this.systemErrorMessage_text, genericError);
    }
  }
}
