import test from '@lib/BaseTest';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const records = parse(fs.readFileSync(path.join(__dirname, '../../../test-data/login-user-tests.csv')), {
  columns: true,
  skip_empty_lines: true,
});

for (let i = 0; i < records.length; i++) {
  test(`${records[i].tr_id} Verify ${records[i].scenario}`, async ({ loginPage }) => {
    await test.step(`Given user is able to Navigate to the application`, async () => {
      await loginPage.navigateToURL('/login');
    });

    await test.step(`When User is trying to login`, async () => {
      await loginPage.loginToApplicationUI(records[i].username, records[i].password, false);
      if (records[i].error == 'y') {
        await loginPage.verifyLoginError(records[i].email_field_error, records[i].password_field_error, records[i].generic_error);
      }
    });

    if (records[i].error == 'n') {
      await test.step(`Then User navigates to Profile Page or shows an Error message`, async () => {
        await loginPage.verifyUserIsLoggedIn();
      });

      await test.step(`And User logs out of the application`, async () => {
        await loginPage.logoutApplication();
      });
    }
  });
}
