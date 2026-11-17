const { test, expect } = require("@playwright/test");
const { userSchema } = require("../schemas/userSchema");
const { validateSchema } = require("../helpers/apiHelper");

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

test.describe("User API Tests", () => {
  userIds.forEach((userId) => {
    test(`GET user ID ${userId} should return correct data`, async () => {
      const data = await getAndValidateUser(apiRequest, userId);

      expect(data.id).toBe(userId);
    });
  });
});

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

test("GET user with authorization header 2", async () => {
  const response = await apiRequest.get("/users/1", {
    headers: {
      Authorization: "Bearer fake-token-123",
    },
  });

  expect(response.status()).toBe(200);

  const headers = response.headers();

  expect(headers).toHaveProperty("content-type");
});

test("API should return 401 for invalid token", async ({ page }) => {
  await page.route("**/auth/profile", async (route) => {
    const headers = route.request().headers();

    if (headers.authorization !== "Bearer valid-token") {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Unauthorized",
        }),
      });
    }
  });

  await page.goto("https://example.com");

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

  await page.goto("https://example.com");

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

  await page.goto("https://example.com");

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
