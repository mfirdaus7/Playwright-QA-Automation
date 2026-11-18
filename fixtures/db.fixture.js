const { test: base } = require("@playwright/test");
const Database = require("better-sqlite3");

exports.test = base.extend({
  db: async ({}, use) => {
    // Setup: create an isolated in-memory database
    const db = new Database(":memory:");

    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        age INTEGER
      )
    `);

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

    // Give the database to the test
    await use(db);

    // Teardown: close connection after the test
    db.close();
  },
});

exports.expect = require("@playwright/test").expect;
