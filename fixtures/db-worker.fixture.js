const { test: base } = require("@playwright/test");
const Database = require("better-sqlite3");

exports.test = base.extend({
  db: [
    async ({}, use) => {
      // Setup: create database once per worker
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

      await use(db);

      // Teardown: close after worker finishes
      db.close();
    },
    { scope: "worker" },
  ],
});

exports.expect = require("@playwright/test").expect;
