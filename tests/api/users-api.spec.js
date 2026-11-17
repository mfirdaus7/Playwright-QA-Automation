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

test.beforeAll(async ({ playwright }) => {
  apiRequest = await playwright.request.newContext({
    baseURL: process.env.API_BASE_URL,
  });
});

test.afterAll(async () => {
  await apiRequest.dispose();
});

const userIds = [1, 2, 3];

test.describe("Users API Tests", () => {
  userIds.forEach((userId) => {
    test(`GET user ID ${userId} should return correct data`, async () => {
      const data = await getAndValidateUser(apiRequest, userId);

      expect(data.id).toBe(userId);
    });
  });
});
