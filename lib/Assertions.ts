import type { Locator, Page } from '@playwright/test';
import { BrowserContext, expect } from '@playwright/test';
import console from './Reporter';

export class Assertions {
  readonly page: Page;
  readonly context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  private async logText(assertionPerformed: string, expected: string, actual: string, message: string, locator?: string): Promise<void> {
    if (locator != undefined) console.log(`Expect ${assertionPerformed} expected <${expected}> vs actual <${actual}> ${message}`);
    else console.log(`Expect ${assertionPerformed} Element ${locator}`);
  }

  /** Negative Assertions */

  async toNotEqual(expectedValue: string, actualValue: string, message: string = `Verifying if <expected> is equal to <actual>`) {
    await this.logText('toNotEqual', expectedValue, actualValue, message);
    await expect(expectedValue, message).not.toEqual(actualValue);
  }

  async toNotBeChecked(locator): Promise<void> {
    await this.logText('toNotBeChecked', '', '', locator);
    await expect(locator).not.toBeChecked();
  }

  async toNotBeDisbaled(locator): Promise<void> {
    await this.logText('toNotBeDisabled', '', '', locator);
    await expect(locator).not.toBeDisabled();
  }

  async toNotBeEnabled(locator): Promise<void> {
    await this.logText('toNotBeEnabled', '', '', locator);
    await expect(locator).not.toBeEnabled();
  }

  async toNotHaveAttribute(locator, attrName, attrValue): Promise<void> {
    await this.logText(`toNotHaveAttribute Name: ${attrName} Value: ${attrValue}`, '', '', locator);
    await expect(locator).not.toHaveAttribute(attrName, attrValue);
  }

  async toNotHaveCount(locator, count): Promise<void> {
    await this.logText(`toNotHaveCount Count: ${count}`, '', '', locator);
    await expect(locator).not.toHaveCount(count);
  }

  async toNotHaveCSS(locator, cssName, cssValue): Promise<void> {
    await this.logText(`toNotHaveCSS Name: ${cssName} Value: ${cssValue}`, '', '', locator);
    await expect(locator).not.toHaveCSS(cssName, cssValue);
  }

  /**
   * this should work for both single and multiple locator element
   * @param actualText
   * @param expectedText - string or Regular Expression should also work
   * @param message
   */
  async toNotContainText(actualText, expectedText, message: string = `Verifying expectedText contains the actualText`) {
    await this.logText('toNotContainText', expectedText, actualText, message);
    await expect(actualText, message).not.toHaveText(expectedText);
  }

  /**
   * this should work for both single and multiple locator element
   * @param actualText
   * @param expectedText - string or Regular Expression should also work
   * @param message
   */
  async toNotContainValue(actualValue, expectedValue, message: string = `Verifying expectedText contains the actualText`) {
    await this.logText('toNotContainText', expectedValue, actualValue, message);
    await expect(actualValue, message).not.toHaveValue(expectedValue);
  }

  /**
   * this should work for both single and multiple locator element
   * @param actualText
   * @param expectedText - Array of values
   * @param message
   */
  async toNotContainValues(actualValue, expectedValue, message: string = `Verifying expectedText contains the actualText`) {
    await this.logText('toNotContainText', expectedValue, actualValue, message);
    await expect(actualValue, message).not.toHaveValues(expectedValue);
  }

  async toNotBeVisible(locator: string, message: string = `Verifying if the Text is present on the Page`) {
    await console.log(`Verifying '${locator}' is not present on the Page`);
    await expect(this.page.locator(locator)).not.toBeVisible();
  }

  /** Positive Assertions */
  async toEqual(expectedValue: string, actualValue: string, message: string = `Verifying if <expected> is equal to <actual>`) {
    await this.logText('toBeEqual', expectedValue, actualValue, message);
    await expect(expectedValue, message).toEqual(actualValue);
  }

  async toBeChecked(locator): Promise<void> {
    await this.logText('toBeChecked', '', '', locator);
    await expect(locator).toBeChecked();
  }

  async toBeDisbaled(locator): Promise<void> {
    await this.logText('toBeDisabled', '', '', locator);
    await expect(locator).toBeDisabled();
  }

  async toBeEnabled(locator): Promise<void> {
    await this.logText('toBeEnabled', '', '', locator);
    await expect(locator).toBeEnabled();
  }

  async toHaveAttribute(locator, attrName, attrValue): Promise<void> {
    await this.logText(`toHaveAttribute Name: ${attrName} Value: ${attrValue}`, '', '', locator);
    await expect(locator).toHaveAttribute(attrName, attrValue);
  }

  async toHaveCount(locator, count): Promise<void> {
    await this.logText(`toHaveCount Count: ${count}`, '', '', locator);
    await expect(locator).toHaveCount(count);
  }

  async toHaveCSS(locator, cssName, cssValue): Promise<void> {
    await this.logText(`toHaveCSS Name: ${cssName} Value: ${cssValue}`, '', '', locator);
    await expect(locator).toHaveCSS(cssName, cssValue);
  }

  /**
   * this should work for both single and multiple locator element
   * @param actualText
   * @param expectedText - string or Regular Expression should also work
   * @param message
   */
  async toContainText(actualText, expectedText, message: string = `Verifying expectedText contains the actualText`) {
    await this.logText('toContainText', expectedText, actualText, message);
    await expect(actualText, message).toHaveText(expectedText);
  }

  /**
   * this should work for both single and multiple locator element
   * @param actualText
   * @param expectedText - string or Regular Expression should also work
   * @param message
   */
  async toContainValue(actualValue, expectedValue, message: string = `Verifying expectedText contains the actualText`) {
    await this.logText('toContainText', expectedValue, actualValue, message);
    await expect(actualValue, message).toHaveValue(expectedValue);
  }

  /**
   * this should work for both single and multiple locator element
   * @param actualText
   * @param expectedText - Array of values
   * @param message
   */
  async toContainValues(actualValue, expectedValue, message: string = `Verifying expectedText contains the actualText`) {
    await this.logText('toContainText', expectedValue, actualValue, message);
    await expect(actualValue, message).toHaveValues(expectedValue);
  }

  async toContainTextByMultipleElementLocator(
    locator,
    expectedText,
    message: string = `Verifying if the Multiple Element Locator <${locator}> contains the expected Text ${expectedText}`,
  ) {
    await this.page.waitForSelector(locator);
    if ((await this.page.locator(locator).count()) > 0) {
      const allElements = await this.page.locator(locator).allTextContents();
      await console.log(message);
      await expect(allElements, message).toContain(expectedText);
    } else {
      await console.log(`${locator} - Element Not Found`);
      throw new Error('Element not found ' + locator);
    }
  }

  async toBeTruthyText(expectedText, message: string = `Verifying if the Text is present on the Page`) {
    await console.log(`Verifying '${expectedText}' is present on the Page`);
    const element = this.page.getByText(expectedText);
    await expect(element !== undefined, message).toBeTruthy();
  }

  async toBeVisible(locator: string, message: string = `Verifying if the Text is present on the Page`) {
    await console.log(`Verifying '${locator}' is present on the Page`);
    await expect(this.page.locator(locator)).toBeVisible();
  }
}
