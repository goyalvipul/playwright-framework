import { Reporter, TestCase, TestError, TestResult, TestStep } from '@playwright/test/reporter';
const winston = require(`winston`);
let tr_comments: Array<{ type: string; description?: string }> = new Array<{ type: string; description?: string }>();

const console1 = new winston.transports.Console();
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    // - Write all logs with importance level of `info` or less than it
    new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
  ],
});

// Writes logs to console
logger.add(console1);

class CustomReporter implements Reporter {
  onTestBegin(test: TestCase): void {
    logger.info(`~~~~~~~ Test Case Started : ${test.title} ~~~~~~~`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    logger.info(`~~~~~~~ Test Case Completed : ${test.title} Status : ${result.status} ~~~~~~~~`);
    for (let i = 0; i < tr_comments.length; i++) {
      test.annotations.push(tr_comments[i]);
    }
    let replaceSlash = /\//gi;
    let replaceSpace = /\ /gi;
    let screenshotPath = 'test-results/' + test.titlePath()[2].replace(replaceSlash, '-').replace('.test.ts', '');
    screenshotPath += '-' + test.titlePath()[3].replace(replaceSpace, '-') + '-' + test.titlePath()[1];
    if (result.status == 'passed') screenshotPath += '/test-finished-1.png';
    else screenshotPath += '/test-failed-1.png';
    test.annotations.push({ type: 'testrail_attachment', description: screenshotPath });
    tr_comments.length = 0;
  }

  onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
    if (step.category === `test.step`) {
      logger.info(`Executing Step : ${step.title}`);
    }
  }

  onError(error: TestError): void {
    logger.error(error.message);
  }

  onStdOut(chunk: string | Buffer, test: TestCase, result: void | TestResult): void {
    logger.info(`${chunk}`);
    tr_comments.push({ type: 'testrail_result_comment', description: `${chunk}` });
  }

  printsToStdio(): boolean {
    return true;
  }
}

export default CustomReporter;
