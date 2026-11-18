const { test, expect } = require("../../fixtures/db.fixture");

test("should return 2 users from isolated database", async ({ db }) => {
  const users = db.prepare("SELECT * FROM users").all();

  expect(users).toHaveLength(2);
});

test("should find Ali in isolated database", async ({ db }) => {
  const user = db.prepare("SELECT * FROM users WHERE name = ?").get("Ali");

  expect(user).toBeDefined();
  expect(user.age).toBe(26);
});

test("should not share database changes between tests", async ({ db }) => {
  db.prepare("DELETE FROM users WHERE name = ?").run("Ali");

  const users = db.prepare("SELECT * FROM users").all();

  expect(users).toHaveLength(1);
  expect(users[0].name).toBe("Siti");
});
