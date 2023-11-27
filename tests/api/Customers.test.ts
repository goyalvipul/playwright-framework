import test from '@lib/BaseTest';
import { faker } from '@faker-js/faker';

let custId;

test(`@API Verify Customer API are able to modify and create customers`, async ({ request, assert }) => {
  await test.step(`Get Authentication Access Code`, async () => {
    const response = await request.api('access-token/CreateAccessToken');
    global.ACCESS_TOKEN = await response.access_token;
  });

  await test.step(`User is able to create a customer using createCustomer API `, async () => {
    const email = faker.internet.email();
    const response = await request.api('customers/CreateCustomer', '', `email=${email}`);
    custId = await response.customer.id;
  });

  await test.step(`User is able to fetch the details of the created Customer using getCustomer API`, async () => {
    const response = await request.api('customers/GetCustomerById', `customer-id=${custId}`);
    const actualCustomerId = response.id;
    assert.toEqual(custId, actualCustomerId, 'Validating the Creation of Customer using createCustomerId API');
  });

  await test.step(`User is able to delete the created customer using deleteCustomer API`, async () => {
    const response = await request.api('customers/DeleteCustomerById', `customer-id=${custId}`);
    const deleteCustomerId = await response.id;
    assert.toEqual(custId, deleteCustomerId, 'Validating the Deletion of Customer using deleteCustomerId API');
  });
});
