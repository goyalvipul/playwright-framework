import { APIResponse, expect, Page, BrowserContext } from '@playwright/test';
import console from './Reporter';
import path from 'path';
import { config } from '@config/config';
import base64 from 'base-64';

/**
 *@author Vipul Goyal
 *@description This class is used to perform API Functions. It includes all the GET, POST, PUT, DELETE functions.
 *
 * You Don't need to create an instance of this class in TEST classes and should be used via BastTest Class instead.
 *
 *@example apiRequest function is a global function which can be used to hit any API request within the framework
 */

export class APIActions {
  readonly page: Page;
  readonly context: BrowserContext;

  jsonPath: any;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  /**
   * @author Vipul Goyal
   *
   * @description function helps to request any REST API.
   *
   * @augments
   * @param apiEndpointFilePath - all the API information is saved in json filed under test-data/apis folder.
   *
   * We need to maintain json files for all the APIs which we need to test and use.
   * @example
   * "access-token/CreateAccessToken"
   * 1. Do no mention any extension.
   * 2. Mention the exact folder name after apis.
   * 3. Mention exact endpoint or .json file name.
   * 4. JSON File name IS Case Sensative.
   *
   * @param urlValue = "" | value as detailed below
   * ```
   * 1. Values in the URL - {auth_url}, {host}, {base_url}, {projectKey} are already handled. They will auto added to the URL.
   * 2. Values apart from mentioned above should be listed under argument - "urlValue"
   * 3. While mentioning the value of urlValue, do not add {brackets}
   * 4. For multiple values, comma separated values can be mentioned.
   * ```
   * @example
   * URL = {host}/{projectKey}/customers/{customer-id}
   * urlValue = "customer-id=ID" where ID is the actual customer id.
   *
   * @param updateBodyValue = "" | value as detailed below
   * @example
   * CreateCustomer Payload (body) looks like - 
   * {
      "url": "{host}/{projectKey}/customers",
      "method": "POST",
      "headers": {},
      "body": {
        "email": "juanss.joe@yopmail.com",
        "firstName": "Juan",
        "lastName": "Joe",
        "password": "***"
      }
    }
   * In this email needs to be dynamic. 
    So updateBodyValue = "email=SOME_FAKE_VALUE" -- SOME_FAKE_VALUE can be fetched using faker library
   *    
   * @returns - Return a JSON format value structure
   */
  async api(apiEndpointFilePath: string, urlValues: string = '', updateBodyValues: string = '', JSONreturn = true) {
    await this.readJsonFile(apiEndpointFilePath);
    let apiURL = await this.readUrl(urlValues);
    let requestMethod = await this.readMethodType();
    let headers: Headers;
    if (apiEndpointFilePath.includes('access-token')) {
      headers = await this.readAccessTokenHeaders();
    } else headers = await this.readHeaders();
    let requestBody = await this.readBody(updateBodyValues);

    await console.log(` ~~~ API request headers and body ~~~~~ \n`);
    await console.log(` api url - ${apiURL} \n`);
    await console.log(` request method - ${requestMethod} \n`);
    await console.log(` headers - ${headers} `);
    await console.log(` request body - ${JSON.stringify(requestBody)} \n`);

    try {
      const response = await fetch(apiURL, {
        method: requestMethod,
        headers,
        body: requestBody ? JSON.stringify(requestBody) : null,
      });
      if (!response.ok) {
        await console.log(` ~~~ API Error ~~~~~ `);
        await console.log(` HTTP error! status: ${response.status} `);
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText} ${JSON.stringify(response.body)}`);
      }
      if (JSONreturn) {
        const data = await response.json();
        await console.log(` ~~~ API Response ~~~~~ `);
        await console.log(`${JSON.stringify(data).replace(data.access_token, '**********').replace(data.password, '**********')} `);
        return data;
      } else {
        await console.log(` ~~~ API Response ~~~~~ `);
        await console.log(`${response} `);
        return response;
      }
    } catch (error) {
      await console.log(` ~~~ API Error ~~~~~ `);
      await console.log(`${error} `);
      console.error('Error:' + error);
      throw error;
    }
  }

  private async readJsonFile(apiFilePath: string) {
    this.jsonPath = require(path.join(__dirname, '../test-data/apis/', `${apiFilePath}.json`));
  }

  private async readUrl(urlValues: string): Promise<string> {
    let url = this.jsonPath.url;
    url = url
      .replace('{auth_url}', config.auth_url)
      .replace('{host}', config.host)
      .replace('{base_url}', config.base_url)
      .replace('{projectKey}', config.projectKey);
    url = await this.decriptUrlValues(url, urlValues);
    return await url;
  }

  private async readMethodType() {
    return await this.jsonPath.method;
  }

  private async readHeaders() {
    /** I don't see a case where we need anything more in headers -- We can come back to this if we encounter any such case */
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + global.ACCESS_TOKEN);
    return headers;
  }

  private async readAccessTokenHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Basic ' + base64.encode(`${process.env.CLIENT_ID}` + ':' + `${process.env.CLIENT_SECRET}`));
    return headers;
  }

  private async readBody(updateBodyValues: string) {
    let body = await this.jsonPath.body;
    if (body == '' || body == undefined) return null;
    else {
      if (updateBodyValues == '') return body;
      else {
        let values = updateBodyValues.split(',');
        for (let i = 0; i < values.length; i++) {
          let value = values[i].split('=');
          body[value[0]] = value[1];
        }
      }
    }
    return await body;
  }

  private async decriptUrlValues(url: string, urlValues: string): Promise<string> {
    if (urlValues == '') return url;
    let values = urlValues.split(',');
    for (let i = 0; i < values.length; i++) {
      url = url.replace(`{${values[i].split('=')[0]}}`, values[i].split('=')[1]);
    }
    return url;
  }

  /**
   * @author Vipul Goyal
   *
   * @description verifies Status code returned by the Request
   *
   * @param response - Actual Status Code
   *
   * @returns void. It asserts actual status code to be 200 OK
   */
  async verifyStatusCode(response: APIResponse): Promise<void> {
    await console.log(` verify status code, expected: 200, actual: ${response} `);
    await expect(response, `200 Status code was not displayed.`).toBeOK();
  }

  /**
   * @author Vipul Goyal
   *
   * verifying the response body
   *
   * @param expectedResponseBodyParams
   * @param responsePart
   * @param responseType
   */
  async verifyResponseBody(expectedResponseBodyParams: string, responsePart: JSON, responseType: string): Promise<void> {
    let status = true;
    let fieldNames = `Parameter`;
    const headers = expectedResponseBodyParams.split('|');
    const responseToString = JSON.stringify(responsePart).trim();
    await console.log(` verifying the Response Body `);
    await console.log(` expected response body params - ${expectedResponseBodyParams} `);
    await console.log(` expected response part - ${responsePart} `);
    await console.log(` expected response type - ${responseType} `);
    for (let headerKey of headers) {
      if (!responseToString.includes(headerKey.trim())) {
        status = false;
        fieldNames = fieldNames + `, ` + headerKey;
        break;
      }
    }
    await console.log(` ${fieldNames} was not present in ${responseType}, status: ${status} `);
    expect(status, `${fieldNames} was not present in ${responseType}`).toBe(true);
  }

  async verifyResponseHeader(expectedResponseHeaderParams: string, responsePart: Array<{ name: string; value: string }>, responseType: string): Promise<void> {
    let status = true;
    let fieldNames = `Parameter`;
    await console.log(` expected response Header params - ${expectedResponseHeaderParams} `);
    await console.log(` expected response part - ${responsePart} `);
    for (let responseKey of responsePart) {
      if (!expectedResponseHeaderParams.includes(responseKey.name.trim())) {
        status = false;
        fieldNames = fieldNames + ' ,' + responseKey.name;
        break;
      }
    }
    await console.log(` ${fieldNames} was not present in ${responseType}, status: ${status} `);
    expect(status, `${fieldNames} was not present in ${responseType}`).toBe(true);
  }
}
