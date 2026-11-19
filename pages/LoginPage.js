const { BasePage } = require("./BasePage");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    this.usernameInput = page.locator("#username");
    this.passwordInput = page.locator("#password");
    this.submitButton = page.locator("#submit");
    this.errorMessage = page.locator("#error");
  }

  async goto() {
    await super.goto("https://practicetestautomation.com/practice-test-login/");
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async logout() {
    await this.page.getByRole("link", { name: "Log out" }).click();
  }
}

module.exports = { LoginPage };
