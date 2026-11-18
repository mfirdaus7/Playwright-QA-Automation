const { test, expect } = require("@playwright/test");
const { AuthApi } = require("../../api-clients/authApi");

let apiContext;
let authApi;
let accessToken;

test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    baseURL: "https://dummyjson.com",
  });

  authApi = new AuthApi(apiContext);

  const response = await authApi.login({
    username: "emilys",
    password: "emilyspass",
  });

  expect(response.status()).toBe(200);

  const data = await response.json();
  accessToken = data.accessToken;
  expect(accessToken).toBeTruthy();
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test("Authentication - Access protected endpoint", async () => {
  const response = await authApi.getCurrentUser(accessToken);

  expect(response.status()).toBe(200);

  const data = await response.json();
  expect(data.username).toBe("emilys");
});

test("Authentication - Reject invalid token", async () => {
  const response = await authApi.getCurrentUser("invalid-token-123");

  expect(response.status()).toBe(401);
});

test("Authentication - Reject request without token", async () => {
  const response = await authApi.getCurrentUser("");

  expect(response.status()).toBe(401);
});

test("Authentication - Refresh access token", async () => {
  // Login to obtain refresh token
  const loginResponse = await authApi.login({
    username: "emilys",
    password: "emilyspass",
  });

  expect(loginResponse.status()).toBe(200);

  const loginData = await loginResponse.json();

  expect(loginData.refreshToken).toBeTruthy();

  // Refresh access token
  const refreshResponse = await authApi.refreshToken(loginData.refreshToken);

  expect(refreshResponse.status()).toBe(200);

  const refreshData = await refreshResponse.json();

  expect(refreshData.accessToken).toBeTruthy();
  expect(refreshData.refreshToken).toBeTruthy();

  // Step 4: Reuse the newly issued refresh token
  const secondRefreshResponse = await authApi.refreshToken(
    refreshData.refreshToken,
  );

  expect(secondRefreshResponse.status()).toBe(200);

  const secondRefreshData = await secondRefreshResponse.json();

  expect(secondRefreshData.accessToken).toBeTruthy();
  expect(secondRefreshData.refreshToken).toBeTruthy();

  // Verify first refreshed access token
  const userResponse = await authApi.getCurrentUser(refreshData.accessToken);

  expect(userResponse.status()).toBe(200);

  // Verify second refreshed access token
  const secondUserResponse = await authApi.getCurrentUser(
    secondRefreshData.accessToken,
  );

  expect(secondUserResponse.status()).toBe(200);

  expect(userResponse.status()).toBe(200);
});

test("Authentication - Reject invalid refresh token", async () => {
  const response = await authApi.refreshToken("invalid-refresh-token-123");

  expect(response.status()).toBe(403);

  const data = await response.json();

  expect(data.accessToken).toBeUndefined();
  expect(data.refreshToken).toBeUndefined();
});
