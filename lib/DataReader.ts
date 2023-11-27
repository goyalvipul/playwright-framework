import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import type { Locator, Page } from '@playwright/test';
import { BrowserContext, expect } from '@playwright/test';
import { testConfig } from '../testConfig';
import { Workbook } from 'exceljs';

/**
 * @author Vipul Goyal
 *
 * This file helps to read Data from your Test Data files.
 *
 * This file is assuming that you are using csv or excel files for Test data.
 *
 * Common function can be used to get the Test Data.
 *
 */

export class DataReader {
  readonly page: Page;
  readonly context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  async decipherPassword(): Promise<string> {
    const key = `SECRET`;
    // Keeping the code intact for future use.
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

  /**
   * @author Vipul Goyal
   *
   * it helps to read the csv files in the test-data folder and retrive the data based on column name and row number.
   * @param fileName check the file name from test-data folder. and give the csv fileName along with the extension.
   *
   * if your test data resides within a sub-folder in test-data folder, mention the folder name along with your file name
   *
   * @param rowNumber - OPTIONAL - Row number for which the value needs to be fetched
   * @param columnName - OPTIONAL - Column Name (Header Name) for which the value needs to be fetched
   *
   * @important - rowNumber and columnName if provided should be provided together. Sending Only one of the value will not work.
   *
   * @example If testData file name "data.csv" resides within a subfolder named "login-page", the path which needs to be provided:
   *
   * filePath = login-page/data.csv
   *
   * this function will automatically understand the folder structure and read the file for you
   *
   * @returns
   * 1. If { rowNumber and columnName are not provided } --> Return the complete csv within an Array
   * 2. If { rowNumber and columnName are provided } --> Return specific value from the CSV in String format
   * 3. Its important to send rowNumber and columnName together. Only one will not work and will not return anything
   */
  async getDataFromCSV(fileName: string, rowNumber?: number, columnName?: string) {
    if (!fileName.includes('.csv')) {
      throw new Error('Test Data File extension not provided. Provide "*.csv" as an extension.');
    }

    const records = parse(fs.readFileSync(path.join(__dirname, '../test-data/', `/${fileName}`)), {
      columns: true,
      skip_empty_lines: true,
    });
    if (rowNumber != undefined && columnName != undefined) {
      console.log('1' + records[rowNumber][columnName]);
      console.log('2' + JSON.stringify(records[rowNumber][columnName]));
      return records[rowNumber][columnName];
    } else return records;
  }

  async getDataFromExcel(fileName: string, sheetName: string, rowNum: number, cellNum: number): Promise<string> {
    const workbook = new Workbook();
    await console.log(` Reading Data from Excel - File path - ./Downloads/${fileName} `);
    await console.log(` Sheetname Accessed - ${sheetName} `);
    return workbook.xlsx.readFile(`./Downloads/${fileName}`).then(function () {
      const sheet = workbook.getWorksheet(sheetName);
      console.log(` value fetched - ${sheet.getRow(rowNum).getCell(cellNum).toString()} `);
      return sheet.getRow(rowNum).getCell(cellNum).toString();
    });
  }
}
