import { allure } from 'allure-playwright';

export class CustomReporter {
  /**
   * @author Vipul Goyal
   *
   * Best way to do this create an instance of this class and name the instance as "console"
   * This is override all the console.log functions you are using while coding
   *
   * @example
   * import console from "@lib/Reporter"
   *
   * function anything(){ console.log ("Output goes on Terminal and Allure Reports")}
   * @description the "console.log" used in the above example will call Custom Reporter function instead of normal Node console.
   * putting your outputs not only on the output console, but also on your Allure Report
   *
   * @param message
   */

  async log(message: string): Promise<void> {
    allure.logStep(`${message}`);
    console.log(`${message}`);
  }

  /**
   *
   * @param message error message printed on allure report
   */
  async error(message: any): Promise<void> {
    allure.logStep(`ERROR: ${message}`);
    console.error(`${message}`);
  }

  /**
   *
   * @param description description printed on allure report
   */
  async addDescription(description): Promise<void> {
    allure.description(description);
  }

  /**
   * parameters with Key and Value will be printed on Allure report
   * @param name
   * @param value
   */
  async addParameters(name, value): Promise<void> {
    allure.addParameter(name, value);
  }

  /**
   * screenshots goes to Allure Report.
   *
   * @disclaimer You need not to explicitly call this function, as sending screenshots to the report is handled internally by the framework already.
   *
   * @param name
   * @param src
   */
  async addScreenshot(name, src): Promise<void> {
    allure.attachment(name, src, '');
  }
}

export default new CustomReporter();
