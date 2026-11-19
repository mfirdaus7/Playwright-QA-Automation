const { test: base } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");

exports.test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await use(loginPage);
  },
});
