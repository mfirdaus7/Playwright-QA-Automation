const { test: base } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");

exports.test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    try {
      await use(loginPage);
    } finally {
      console.log("Login fixture cleanup completed");
    }
  },
});
