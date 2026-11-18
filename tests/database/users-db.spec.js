const { test, expect } = require("@playwright/test");
const db = require("../database/db");

test.describe("Users Database Tests", () => {
  test.beforeEach(() => {
    db.prepare("DELETE FROM users").run();

    db.prepare(
      `
      INSERT INTO users (name, email, age)
      VALUES (?, ?, ?)
    `,
    ).run("Ali", "ali@example.com", 26);

    db.prepare(
      `
      INSERT INTO users (name, email, age)
      VALUES (?, ?, ?)
    `,
    ).run("Siti", "siti@example.com", 30);
  });

  test("should return 2 users", () => {
    const users = db.prepare("SELECT * FROM users").all();

    expect(users).toHaveLength(2);
  });

  test("should find Ali with age 26", () => {
    const user = db.prepare("SELECT * FROM users WHERE name = ?").get("Ali");

    expect(user.age).toBe(26);
  });

  test("should not retain data changes from previous test", () => {
    db.prepare("DELETE FROM users WHERE name = ?").run("Ali");

    const users = db.prepare("SELECT * FROM users").all();

    expect(users).toHaveLength(1);
    expect(users[0].name).toBe("Siti");
  });

  test("should have clean database state before each test", () => {
    const users = db.prepare("SELECT * FROM users").all();

    expect(users).toHaveLength(2);
    expect(users.map((user) => user.name)).toEqual(["Ali", "Siti"]);
  });
});
