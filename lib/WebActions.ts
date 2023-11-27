import * as CryptoJS from 'crypto-js';
import type { Locator, Page } from '@playwright/test';
import { BrowserContext, expect } from '@playwright/test';
import { testConfig } from '../testConfig';
import console from './Reporter';
import path from 'path';

export class WebActions {
  readonly page: Page;
  readonly context: BrowserContext;

  attributeName: string;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  async decipherPassword(): Promise<string> {
    const key = `SECRET`;
    //ENCRYPT
    // const cipher = CryptoJS.AES.encrypt('Demouat@09',key);
    // console.log(cipher.toString());
    return CryptoJS.AES.decrypt(testConfig.password, key).toString(CryptoJS.enc.Utf8);
  }

  async delay(time: number): Promise<void> {
    await console.log(` Waitng for ${time} ms `);
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }

  private async logText(actionPerformed: string, locator: string): Promise<void> {
    console.log(`${actionPerformed} Element <${locator}>`);
  }

  private async byText(text: string, exact: boolean = true, actionPerformed: string): Promise<Locator> {
    await this.logText(actionPerformed, text);
    return await this.page.getByText(text, { exact });
  }

  private async byRole(role: any, actionPerformed: string): Promise<Locator> {
    await this.logText(actionPerformed, role);
    return await this.page.getByRole(role);
  }

  private async byPlaceHolder(text: string, exact: boolean = true, actionPerformed: string): Promise<Locator> {
    await this.logText(actionPerformed, text);
    return await this.page.getByPlaceholder(text, { exact });
  }

  private async byLabel(text: string, exact: boolean = true, actionPerformed: string): Promise<Locator> {
    await this.logText(actionPerformed, text);
    return await this.page.getByLabel(text, { exact });
  }

  private async byAltText(text: string, exact: boolean = true, actionPerformed: string): Promise<Locator> {
    await this.logText(actionPerformed, text);
    return await this.page.getByText(text, { exact });
  }

  private async byLocator(locator: string, actionPerformed: string = 'Action Performed'): Promise<Locator> {
    await this.logText(actionPerformed, locator);
    return await this.page.locator(locator);
  }

  /**  Click Functions */
  /**
   * Click on Element based on Text
   * @param text
   * @param force default: false
   * @param exact default: true
   */
  async clickByText(text: string, force: boolean = false, exact: boolean = true): Promise<void> {
    await (await this.byText(text, exact, 'Clicked')).click({ force });
  }

  /**
   * Click Element based on Locator
   * @param locator <String>: provide the string value of the locator which needs to be clicked
   * @param force default: false. Used when any element is hidden and you still want to interact with the element
   */
  async clickByLocator(locator: string, force: boolean = false): Promise<void> {
    await (await this.byLocator(locator, 'Clicked')).click({ force });
  }

  /**
   * Click Element based on Label
   * @param label <String>: provide the string value of the label which needs to be clicked
   * @param force default: false. Used when any element is hidden and you still want to interact with the element
   */
  async clickByLabel(label: string, exact: boolean = true, force: boolean = false): Promise<void> {
    await (await this.byLabel(label, exact, 'Clicked')).click({ force });
  }

  /**
   * Click Element based on Role
   * @param role <String>: provide the string value of the role which needs to be clicked
   * @param force default: false. Used when any element is hidden and you still want to interact with the element
   */
  async clickByRole(role: string, force: boolean = false): Promise<void> {
    await (await this.byRole(role, 'Clicked')).click({ force });
  }

  /**
   * Click Element based on placeholderText
   * @param placeholderText <String>: provide the string value of the placeholderText which needs to be clicked
   * @param force default: false. Used when any element is hidden and you still want to interact with the element
   */
  async clickByPlaceholder(placeholderText: string, exact: boolean = true, force: boolean = false): Promise<void> {
    await (await this.byPlaceHolder(placeholderText, exact, 'Clicked')).click({ force });
  }

  /**
   * Click Element based on AltText
   * @param altText <String>: provide the string value of the altText which needs to be clicked
   * @param force default: false. Used when any element is hidden and you still want to interact with the element
   */
  async clickByAltText(altText: string, exact: boolean = true, force: boolean = false): Promise<void> {
    await (await this.byAltText(altText, exact, 'Clicked')).click({ force });
  }

  /**
   * Click Element using JavaScript
   * @param locator
   */
  async clickElementJS(locator: string): Promise<void> {
    await console.log(` Click on Element JS <${locator}> `);
    await this.page.$eval(locator, (element: HTMLElement) => element.click());
  }

  /**
   * helps to click an elements based on its text within the iframe
   * @param frame
   * @param text
   */
  async clickElementByTextWithinAFrame(frame: string, text: string): Promise<void> {
    await console.log(` Click the Element <${text}> within the iFrame <${frame}>>  `);
    await this.page.frameLocator(frame).getByText(text).click();
  }

  /**  Fill Text Functions */

  /**
   * Enter Text by Locator
   * @param locator <String>: provide string value locator
   * @param data <String>: Provide the TEXT which needs to be entered in the input field.
   */
  async fillTextByLocator(locator: string, data: string): Promise<void> {
    await (await this.byLocator(locator, `Entered Text <${data}>`)).fill(data);
  }

  /**
   * Enter Text by Role
   * @param role <String>: provide string value Role of the element in DOM structure
   * @param data <String>: Provide the TEXT which needs to be entered in the input field.
   */
  async fillTextByRole(role: any, data: string): Promise<void> {
    await (await this.byRole(role, `Entered Text <${data}>`)).fill(data);
  }

  /**
   * Enter Text by Label
   * @param label
   * @param data <String>: Provide the TEXT which needs to be entered in the input field.
   */
  async fillTextByLabel(label: string, data: string, exact: boolean = false): Promise<void> {
    await (await this.byLabel(label, exact, `Entered Text <${data}>`)).fill(data);
  }

  /**
   * Enter Text by Text (Element Identification by Text)
   * @param text <String>: innerText of the element using which it can be identified in the DOM Structure
   * @param data <String>: Provide the TEXT which needs to be entered in the input field.
   */
  async fillTextByElementText(text: string, data: string, exact: boolean = false): Promise<void> {
    await (await this.byText(text, exact, `Entered Text <${data}>`)).fill(data);
  }

  async fillTextWithinAFrame(frame: string, text: string, data: string): Promise<void> {
    await console.log(` Entering the Text <${data}> in the field text : <${text} within the iFrame <${frame}>>  `);
    await this.page.frameLocator(frame).getByText(text).fill(data);
  }

  /** GET/FETCH Functions */

  async getAttribute(locator: string, attributeName: string): Promise<String> {
    return await (await this.byLocator(locator, `Get the Attribute Value <${attributeName}>`)).getAttribute(attributeName);
  }

  async getInnerHTML(locator: string, attributeName: string): Promise<String> {
    return await (await this.byLocator(locator, `Get the Innert HTML Value <${attributeName}>`)).innerHTML();
  }

  async getInnerText(locator: string, attributeName: string): Promise<String> {
    return await (await this.byLocator(locator, `Get the Innert Text Value <${attributeName}>`)).innerText();
  }

  async getInputValue(locator: string, attributeName: string): Promise<String> {
    return await (await this.byLocator(locator, `Get the Input Value <${attributeName}>`)).inputValue();
  }

  async getCount(locator: string): Promise<number> {
    return await (await this.byLocator(locator, `Getting count`)).count();
  }

  async getAllElements(locator: string): Promise<Locator[]> {
    return await (await this.byLocator(locator, 'Get all the locators')).all();
  }

  async getInnerTextAllElements(locator: string): Promise<string[]> {
    return await (await this.byLocator(locator, 'Get Inner text for all')).allInnerTexts();
  }

  /** GET Locators of Elements to Interact with THEM */

  /**
   * Filter elements. This function helps to identify a sub element based on its parent element.
   * You can filter down the element based on options
   * @param mainElementLocator
   * @param options  has?: Locator; hasNot?: Locator; hasNotText?: string | RegExp; hasText?: string | RegExp
   * @returns Sub Element Locator
   * @example
   * 
   * const rowLocator = page.locator('tr');
    // ...
    await rowLocator
    .filter({ hasText: 'text in column 1' })
    .actionPerformed();
   * 
   * 
   */
  async getLocatorSubElement(
    mainElementLocator: string,
    options?: { has?: Locator; hasNot?: Locator; hasNotText?: string | RegExp; hasText?: string | RegExp },
  ): Promise<Locator> {
    return await (await this.byLocator(mainElementLocator, 'Filtering Subelement')).filter(options);
  }

  async getFirstElement(locator: string): Promise<Locator> {
    return await (await this.byLocator(locator, 'Get First Element')).first();
  }

  async getLastElement(locator: string): Promise<Locator> {
    return await (await this.byLocator(locator, 'Get Last Element')).last();
  }

  async getNthElement(locator: string, index: number): Promise<Locator> {
    return await (await this.byLocator(locator, `Get Nth Element at index <${index}>`)).nth(index);
  }

  /** Boolean Checks */

  /**
   * help to check or uncheck a checkbox or a radio button.
   * if the checkbox or radio button is already in the said state, it will return and come out of the state
   * @param locator - works for both checkbox and radio button
   * @param check true - check, false - uncheck
   */
  async setChecked(locator: string, check: boolean): Promise<void> {
    await (await this.byLocator(locator, `Setting the state of Checkbox or Radio button to ${check}`)).setChecked(check);
  }

  async isChecked(locator: string): Promise<boolean> {
    return await (await this.byLocator(locator, `Checking if Element is checked`)).isChecked();
  }

  async isDisabled(locator: string): Promise<boolean> {
    return await (await this.byLocator(locator, `Checking if Element is Disabled`)).isDisabled();
  }

  async isEnabled(locator: string): Promise<boolean> {
    return await (await this.byLocator(locator, `Checking if Element is Enabled`)).isEnabled();
  }

  async isEditable(locator: string): Promise<boolean> {
    return await (await this.byLocator(locator, `Checking if Element is Editable`)).isEditable();
  }

  async isHidden(locator: string): Promise<boolean> {
    return await (await this.byLocator(locator, `Checking if Element is Hidden`)).isHidden();
  }

  async isVisible(locator: string): Promise<boolean> {
    return await (await this.byLocator(locator, `Checking if Element is Visible`)).isVisible();
  }

  /**
   * helps focus element, and scrolls the element into the view if not already
   * @param locator
   */
  async focusElement(locator: string): Promise<void> {
    await (await this.byLocator(locator, `Focusing `)).focus();
  }

  async highlightElement(locator: string): Promise<void> {
    await this.focusElement(locator);
    await (await this.byLocator(locator, `Highlighting `)).highlight();
  }

  async hoverOverElement(locator: string): Promise<void> {
    await this.focusElement(locator);
    await (await this.byLocator(locator, `Hovering `)).hover();
  }

  /**
   *
   * @param locator Element on this Keyboard action needs to be performed
   * @param key Keys which can be used.
   * ```
   * F1 - F12, Digit0- Digit9, KeyA- KeyZ, Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape, ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight, ArrowUp, etc.
   * ```
   * Shortcuts such as key: "Control+o" or key: "Control+Shift+T"
   * ```
   */
  async keyboardKeyPress(locator: string, key: string): Promise<void> {
    await (await this.byLocator(locator, 'Keyboard Key used - Key: ' + key)).press(key);
  }

  async scrollIntoView(locator: string): Promise<void> {
    await (await this.byLocator(locator, 'Scrolling Element into View')).scrollIntoViewIfNeeded();
  }

  /** Select Options */

  /**
   * helps to select options from the select element
   * @param locator
   * @param values
   * @example
   * // single selection matching the value or label
      element.selectOption('blue');
      // single selection matching the label
      element.selectOption({ label: 'Blue' });
      // multiple selection for red, green and blue options
      element.selectOption(['red', 'green', 'blue']);
   */
  async selectOption(locator: string, values: null | string | Array<string> | Object | Array<Object>) {
    await (await this.byLocator(locator, 'Selecting option ' + values)).selectOption(values);
  }

  /**
   * upload a file onto the web application
   * @param locator
   * @param fileName
   * 
   * If the name of the file which you want to upload is "data.csv" resides within a subfolder named "data-page", the path which needs to be provided:
   *
   * filePath = login-page/data.csv
   *
   * this function will automatically understand the folder structure and read the file for you
   * 
   * @important
   * Any data file which needs to be uploaded should reside under "test-data/upload-data/"
   * It can contain subfolder as you like, but this should be parent folder. 
   *
   * @example
   * 
   * // Select one file
      await page.getByLabel('Upload file').setInputFiles(path.join(__dirname, 'myfile.pdf'));
      // Select multiple files
      await page.getByLabel('Upload files').setInputFiles([
        path.join(__dirname, 'file1.txt'),
        path.join(__dirname, 'file2.txt'),
      ]);
      // Remove all the selected files
      await page.getByLabel('Upload file').setInputFiles([]);
   * 
   */
  async uploadFile(locator: string, fileName: string): Promise<void> {
    if (!fileName.includes('.')) {
      throw new Error('Upload file should contain their extension');
    }

    let filePaths: Array<string>;
    if (fileName.includes(',')) {
      let files = fileName.split(',');
      for (let i = 0; files.length; i++) {
        let filepath = path.join(__dirname, '../test-data/upload-data/', `${files[i]}`);
        filePaths.push(filepath);
      }
    } else filePaths.push(fileName);
    await (await this.byLocator(locator, 'Upload file ' + fileName)).setInputFiles(filePaths);
  }

  /**
   * Wait for the Element to be - Visible, Attached, Detached, Hidden
   * @param locator
   * @param timeout = time in milliseconds. Defaulted to 10000 ms
   * @param state excepted values = 'attached' | 'detached' | 'visible' | 'hidden'
   * @description
   * Defaults to 'visible'. Can be either:
   *
   * 'attached' - wait for element to be present in DOM.
   *
   * 'detached' - wait for element to not be present in DOM.
   *
   * 'visible' - wait for element to have non-empty bounding box and no visibility:hidden. Note that element without any content or with display:none has an empty bounding box and is not considered visible.
   *
   * 'hidden' - wait for element to be either detached from DOM, or have an empty bounding box or visibility:hidden. This is opposite to the 'visible' option.
   *
   */
  async waitForElement(locator: string, timeout: number = 10000, state: 'attached' | 'detached' | 'visible' | 'hidden' = 'visible'): Promise<void> {
    await (await this.byLocator(locator, 'Waiting')).waitFor({ state: state, timeout: timeout });
  }

  async dragAndDrop(fromLocator: string, toLocator: string): Promise<void> {
    await (await this.byLocator(fromLocator, 'Dragging From')).dragTo(await this.byLocator(toLocator, 'Dragging to'));
  }

  /** When there same Locator points to multiple Elements */

  /**
   * Click the Element based on index in case you have multiple elements in same Locator
   * @param locator
   * @param index
   */
  async clickElementFromListOfElements(locator: string, index: number): Promise<void> {
    let counter = 1;
    for (const list of await this.getAllElements(locator)) {
      if (counter == index) {
        await list.click();
        break;
      }
      counter++;
    }
  }

  /**
   * Get Text from Element based on index in case you have multiple elements in same Locator
   * @param locator
   * @param index
   */
  async getInnerTextOfElementFromListOfElements(locator: string, index: number): Promise<string> {
    let counter = 1;
    for (const list of await this.getInnerTextAllElements(locator)) {
      if (counter == index) {
        return list;
      }
      counter++;
    }
    return '';
  }
}
