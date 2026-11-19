const { test } = require("../../fixtures/login.fixture");
const { expect } = require("@playwright/test");

const invalidLoginData = [
  {
    username: "student",
    password: "WrongPassword",
    expectedError: "Your password is invalid!",
  },
  {
    username: "wronguser",
    password: "Password123",
    expectedError: "Your username is invalid!",
  },
  {
    username: "student",
    password: "123456",
    expectedError: "Your password is invalid!",
  },
];

test.describe("Invalid Login Tests", () => {
  for (const data of invalidLoginData) {
    test(`Invalid login: ${data.username} / ${data.password}`, async ({
      loginPage,
    }) => {
      await loginPage.login(data.username, data.password);

      await expect(loginPage.errorMessage).toContainText(data.expectedError);
    });
  }
});

test("UI - successful login", async ({ loginPage, page }) => {
  await loginPage.login("student", "Password123");

  await expect(page.locator("h1")).toHaveText("Logged In Successfully");
  await expect(page.getByRole("link", { name: "Log out" })).toBeVisible();
});

test("UI - successful logout", async ({ loginPage, page }) => {
  await loginPage.login("student", "Password123");

  await loginPage.logout();

  await expect(page.locator("#username")).toBeVisible();
  await expect(page.locator("#password")).toBeVisible();
});

test("UI - verify login page title", async ({ loginPage }) => {
  const title = await loginPage.getTitle();

  expect(title).toContain("Practice Test Automation");
});
