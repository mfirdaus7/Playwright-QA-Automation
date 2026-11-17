const { test, expect } = require("@playwright/test");
const { userSchema } = require("../../schemas/userSchema");
const { validateSchema } = require("../../helpers/apiHelper");

async function getAndValidateUser(request, userId) {
  const response = await request.get(`/users/${userId}`);

  expect(response.status()).toBe(200);

  const data = await response.json();

  const isValid = validateSchema(userSchema, data);
  expect(isValid).toBe(true);

  return data;
}

let apiRequest;
/* user API tests - setup and teardown */
test.beforeAll(async ({ playwright }) => {
  apiRequest = await playwright.request.newContext({
    baseURL: process.env.API_BASE_URL,
  });
});

test.afterAll(async () => {
  await apiRequest.dispose();
});

const userIds = [1, 2, 3];
/* user API tests - validate user data for multiple user IDs */
test.describe("Users API Tests", () => {
  userIds.forEach((userId) => {
    test(`GET user ID ${userId} should return correct data`, async () => {
      const data = await getAndValidateUser(apiRequest, userId);

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
