import test from '@lib/BaseTest';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
// We can use Steps like in Cucmber format as shown below

const records = parse(fs.readFileSync(path.join(__dirname, '../../test-data/change-password.csv')), {
  columns: true,
  skip_empty_lines: true,
});

// let i = 0;
for (let i = 0; i < records.length; i++) {
  test(`Validate the Change Password Functionality ${i}`, async ({ assert }) => {
    console.log('#####################' + JSON.stringify(records));
    console.log('#####################' + records[i].current_password);
    // await test.step(`Navigate to My Accounts Page`, async () => {});
    // await test.step(`Navigate to Change Password Page`, async () => {});
    // await test.step(`Fill in the Current Password Field`, async () => {});
    // await test.step(`Fill in the New Password Field`, async () => {});
    // await test.step(`Fill in the Confirm Password Field`, async () => {});
    // await test.step(`Click on SAVE button`, async () => {});

    // if (record.error_shown === 'Y') {
    //   assert.verifyExpectedIsEqualToActual('expected', 'actual');
    // } else {
    //   assert.verifyExpectedIsEqualToActual('expected', 'actual');
    // }
  });
}
