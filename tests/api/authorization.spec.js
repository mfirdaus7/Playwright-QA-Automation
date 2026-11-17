const { test, expect } = require("@playwright/test");

let apiRequest;

// Setup mock browser page

async function setupMockPage(page) {
  // Intercept only the homepage, not API requests
  await page.route("http://example.com/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<html><body>Mock Test Page</body></html>",
    });
  });

  await page.goto("http://example.com/");
}

// API request context
test.beforeAll(async ({ playwright }) => {
  apiRequest = await playwright.request.newContext({
    baseURL: process.env.API_BASE_URL,
  });
});

test.afterAll(async () => {
  await apiRequest.dispose();
});

// Test 1: Authorization header
test("GET user with authorization header", async () => {
  const response = await apiRequest.get("/users/1", {
    headers: {
      Authorization: "Bearer fake-token-123",
    },
  });

  expect(response.status()).toBe(200);
  expect(response.headers()).toHaveProperty("content-type");

  const data = await response.json();

  expect(data.id).toBe(1);
});

// Test 2: Mock 401 Unauthorized
test("API should return 401 for invalid token", async ({ page }) => {
  await page.route("**/auth/profile", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Unauthorized",
      }),
    });
  });

  await setupMockPage(page);

  const response = await page.evaluate(async () => {
    const result = await fetch("/auth/profile", {
      headers: {
        Authorization: "Bearer fake-token",
      },
    });

    return {
      status: result.status,
      data: await result.json(),
    };
  });

  expect(response.status).toBe(401);
  expect(response.data.message).toBe("Unauthorized");
});

// Test 3: Mock 403 Forbidden
test("API should return 403 for insufficient permission", async ({ page }) => {
  await page.route("**/auth/admin", async (route) => {
    await route.fulfill({
      status: 403,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Forbidden",
      }),
    });
  });

  await setupMockPage(page);

  const response = await page.evaluate(async () => {
    const result = await fetch("/auth/admin", {
      headers: {
        Authorization: "Bearer valid-token",
      },
    });

    return {
      status: result.status,
      data: await result.json(),
    };
  });

  expect(response.status).toBe(403);
  expect(response.data.message).toBe("Forbidden");
});

// Test 4: Mock 200 Success
test("API should return 200 for valid token", async ({ page }) => {
  await page.route("**/auth/profile", async (route) => {
    const headers = route.request().headers();

    if (headers.authorization === "Bearer valid-token") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Firdaus",
          role: "user",
        }),
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Unauthorized",
        }),
      });
    }
  });

  await setupMockPage(page);

  const response = await page.evaluate(async () => {
    const result = await fetch("/auth/profile", {
      headers: {
        Authorization: "Bearer valid-token",
      },
    });

    return {
      status: result.status,
      data: await result.json(),
    };
  });

  expect(response.status).toBe(200);
  expect(response.data.name).toBe("Firdaus");
  expect(response.data.role).toBe("user");
});
