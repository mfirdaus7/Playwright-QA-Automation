const { test, expect } = require("@playwright/test");
const { userSchema } = require("../../schemas/userSchema");
const {
  validateSchema,
  getValidationErrors,
} = require("../../helpers/apiHelper");
const { invalidUsers } = require("../../test-data/invalidUsers");
const { UsersApi } = require("../../api-clients/usersApi");

async function getAndValidateUser(userId) {
  const response = await usersApi.getUser(userId);

  expect(response.status()).toBe(200);

  const data = await response.json();

  const isValid = validateSchema(userSchema, data);
  expect(isValid).toBe(true);

  return data;
}

let apiRequest;
let usersApi;
/* user API tests - setup and teardown */
test.beforeAll(async ({ playwright }) => {
  apiRequest = await playwright.request.newContext({
    baseURL: process.env.API_BASE_URL,
  });
  usersApi = new UsersApi(apiRequest);
});

test.afterAll(async () => {
  await apiRequest.dispose();
});

const userIds = [1, 2, 3];
/* user API tests - validate user data for multiple user IDs */
test.describe("Users API Tests", () => {
  userIds.forEach((userId) => {
    test(`GET user ID ${userId} should return correct data`, async () => {
      const data = await getAndValidateUser(userId);

      expect(data.id).toBe(userId);
    });
  });
});
/* user API tests - validate non-existing user returns empty object */
test("GET should return empty object for non-existing user", async () => {
  const response = await apiRequest.get("/users/99999");

  expect(response.status()).toBe(404);

  const data = await response.json();

  expect(data).toEqual({});
});

test("Schema validation - Reject invalid Id type", async ({}) => {
  const invalidUser = {
    id: "1", // Invalid type: should be a number
    name: "Test User",
    username: "testuser",
    email: "test@example.com",
    address: {},
    phone: "123456",
    website: "test.com",
    company: {},
  };

  const isValid = validateSchema(userSchema, invalidUser);

  expect(isValid).toBe(false);
});

test("Schema validation - Reject missing required email", async () => {
  const invalidUser = {
    id: 1,
    name: "Test User",
    username: "testuser",
    address: {},
    phone: "123456",
    website: "test.com",
    company: {},
  };

  const errors = getValidationErrors(userSchema, invalidUser);

  expect(errors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        keyword: "required",
        params: expect.objectContaining({
          missingProperty: "email",
        }),
      }),
    ]),
  );

  const isValid = validateSchema(userSchema, invalidUser);

  expect(isValid).toBe(false);
});

for (const testCase of invalidUsers) {
  test(`Data-driven schema validation - ${testCase.scenario}`, async () => {
    const errors = getValidationErrors(userSchema, testCase.data);

    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          keyword: testCase.expectedKeyword,
          params: expect.objectContaining(testCase.expectedParams),
        }),
      ]),
    );
  });
}
