<!-- ABOUT THE PROJECT -->

## About the Project

Playwright Demo - This project is created to demo the Playwright skills for End-To-End Testing

Top Features:

- Easy to Configure.
- **Auto-waits:** for all the relevant checks to pass and only then performs the requested action.
- **Videos:** Records videos for Test Cases.
- **Recorded Logs:**
  - Records the test script and every action on the target page is turned into generated script.
  - Generates trace file, which gives in-depth details of Test Case execution.
- **Faster Test Execution:** Execution of test case is faster when compared with other competitive framework in market.
- **Headful and Headless Execution:** Supports Headful/Headless mode execution for Firefox/Webkit/Google Chrome/Chromium/MS Edge on Windows/Linux/Mac machines.
- **API Tests:** It supports API testing (From Playwright version 1.16 onwards)
- **Browser Simulation:** It can be used to simulate browser behaviour on mobile devices, and supports over 100+ devices.
- **Visual Testing:** It has ability to produce and visually compare screenshots.
- **Slow Mo Execution:** To slow down execution slowMo option is available.
- **Downloads:** Supports 'download' event monitoring, so there is no need for user to actually wait for downloads to finish.
- **Parallel Execution:** Supports Serial and Parallel execution.
- **External Reports:** Allure/HTML Reports are generated after execution with an option to capture screenshot/video/trace file on failure.
- **Logs using Logger:** Logs using logger are generated in info.log file. This is a consolidated file showing execution of all the tests for debugging at one place.
- **VS Code settings:** Formatting is one of main conflict generator. Integrated default VS Code settings which will help to auto pull the formats and eslint settings to your IDE
- **Code Pretier:** Support code formating on save.

Docker Implementation:

- Docker Execution on Playwright images

## How to Setup

### Prerequisites

The following software are required:

- nodejs : Download and Install Node JS from
  ```sh
  https://nodejs.org/en/download/
  ```
- Install Java 8 or above, Allure Reports require Java 8 or higher.
- Install Java 11 instead of Java 8 if you intend to use Sonar Qube.
- allure commandline : Install allure command line for generating Allure Reports using
  ```sh
  npm install -g allure-commandline
  ```

### Installation

1. Clone the repo using below URL

```sh
https://gitlab.com/lululemon/global-tech-services/tech-retail-engineering-can/red/retail-qa-b2b-newplatform
```

```sh
# Keep in mind to use - "RTI-151" branch for now. We will merge this to main.
```

2. Navigate to folder and install npm packages using:

```sh
npm install
```

3. For first time installation run below command to download required browsers

```sh
npx playwright install
```

<!-- USAGE EXAMPLES-->

## Directory Structure

1. allure-results - You can produce Allure reports over and above Playwright HTML Reports for more details and visual reports.
2. html-report - This is the default report produced post each execution.
3. lib - Common Component and Action library which helps to drive GUI, API, Database and Web Actions.
4. logs -
   I have used "loggger" library to capture all the logs while execution. This helps a lot for debugging.
5. pageFactory -
   User POM Design Model.
   Pulling in all common page specific interaction keeping all the page specific interactions and locators in one place.
6. tests -
   a. devices - Emulation related test cases. As the website is Responsive I used Playwright functionality to emulate the devices to validate if the functionalities are working fine with different devices or not.
   b. functional -
   Demo of GUI End-to-End Test Case
   c. visual Comparison -
   This is comparing a actual snapshot to expected smapshot which maps the elements are at correct and expected positions for a particular resolution.
7. Utils - Common utilities required by complete framework. PDF Files which will be read for the content and validated.

## Usage

<h2>
**IMPORTANT** Make sure to USE common functions from "lib" folder as used in one of the example API test file, which will end up producing the console.logs in the allure report.
This will not only help in logs, rather will help is reusability of the code.
</h2>

1. If you want to run a specific file -

```JS
npm run test:single
```

2. If you want to run the tests in Parallel

```JS
npm run test:parallel
```

3. If you want to run only the API tests

```JS
npm run test:parallel:api
```

4. If you want to run the tests in UI mode. Playwright Runner

```JS
npm run test:ui
```

5. Command to run the Visual Comparison Test -

```JS
npm run test:visual
```

6. For recording test scripts :

```JS
npx playwright codegen
```

7. For emulating test cases on any device, in `playwright.config.ts`, under device section provide desired device name and execute :

```JS
npx playwright test Emulation.test.ts --project=Device
```

8. For Allure Report generation execute :

```JS
npm run allureReport
```

9. For HTML Report generation execute below command , single static HTML report(index.html) which can be sent via email is generated in "html-report" folder:
10. For converting HTML Reports to zip file "adm-zip" library is used, the logic is implemented in `global-teardown.ts` , to make sure this runs after all the test are executed and after reports are generated, `global-teardown.ts` is given as a parameter for "globalTeardown" in `playwright.config.ts` file. Results are generated as `html-report.zip` in project directory.
11. For debugging test cases add debug points, the press CNTRL+SHIFT+P and type "debug:debug npm script", on the edit box select desired script.
12. Screenshots, Videos and Trace files will be generated in test-results folder.

## Usage

If you want to use different configuration file, pass "ENV" variable in front of your command.

ENV=qa (Default)
ENV=dev
ENV=staging

## Docker

TO BE IMPLEMENTED - ON THE WAY
