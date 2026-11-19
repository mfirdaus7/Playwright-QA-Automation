async function waitForElement(locator) {
  await locator.waitFor({
    state: "visible",
  });
}

async function getElementText(locator) {
  return await locator.textContent();
}

module.exports = {
  waitForElement,
  getElementText,
};
