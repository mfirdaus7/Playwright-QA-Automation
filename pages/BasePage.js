class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async getTitle() {
    return await this.page.title();
  }

  async getCurrentURL() {
    return this.page.url();
  }
}

module.exports = { BasePage };
