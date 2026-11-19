const { test, expect } = require("../../fixtures/db-worker.fixture");

test.beforeEach(async ({ db }) => {
  // 1. Create orders table first
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product TEXT NOT NULL,
      amount REAL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // 2. Delete child records first
  db.exec("DELETE FROM orders");

  // 3. Delete parent records
  db.exec("DELETE FROM users");

  // 4. Insert users
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

  // 5. Insert orders
  db.prepare(
    `
    INSERT INTO orders (user_id, product, amount)
    VALUES (
      (SELECT id FROM users WHERE name = ?), ?, ?
    )
  `,
  ).run("Ali", "Laptop", 2500);

  db.prepare(
    `
    INSERT INTO orders (user_id, product, amount)
    VALUES (
      (SELECT id FROM users WHERE name = ?), ?, ?
    )
  `,
  ).run("Siti", "Keyboard", 150);
});
test("Worker DB - verify Ali exists", async ({ db }) => {
  const user = db.prepare("SELECT * FROM users WHERE name = ?").get("Ali");

  expect(user).toBeTruthy();
  expect(user.email).toBe("ali@example.com");
});

test("Worker DB - verify Siti exists", async ({ db }) => {
  const user = db.prepare("SELECT * FROM users WHERE name = ?").get("Siti");

  expect(user).toBeTruthy();
  expect(user.age).toBe(30);
});

test("Worker DB - insert new user", async ({ db }) => {
  db.prepare(
    `
    INSERT INTO users (name, email, age)
    VALUES (?, ?, ?)
  `,
  ).run("Ahmad", "ahmad@example.com", 28);

  const user = db.prepare("SELECT * FROM users WHERE name = ?").get("Ahmad");

  expect(user).toBeTruthy();
});

test("Worker DB - rollback transaction", async ({ db }) => {
  const insertUser = db.transaction(() => {
    db.prepare(
      `
      INSERT INTO users (name, email, age)
      VALUES (?, ?, ?)
    `,
    ).run("Abu", "abu@example.com", 35);

    throw new Error("Force rollback");
  });

  // Execute transaction and catch rollback error
  expect(() => insertUser()).toThrow("Force rollback");

  // Verify Abu was not saved
  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get("abu@example.com");

  expect(user).toBeUndefined();
});

test("Worker DB - commit transaction", async ({ db }) => {
  const insertUser = db.transaction(() => {
    db.prepare(
      `
      INSERT INTO users (name, email, age)
      VALUES (?, ?, ?)
    `,
    ).run("Abu", "abu@example.com", 35);
  });

  insertUser();

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get("abu@example.com");

  expect(user).toBeTruthy();
  expect(user.age).toBe(35);
});

test("Worker DB - verify record count", async ({ db }) => {
  const result = db.prepare("SELECT COUNT(*) AS total FROM users").get();

  expect(result.total).toBe(2);
});

test("Worker DB - prevent duplicate email", async ({ db }) => {
  // First insert
  db.prepare(
    `
    INSERT INTO users (name, email, age)
    VALUES (?, ?, ?)
  `,
  ).run("Ali", "duplicate@example.com", 26);

  // Second insert with the same email
  expect(() => {
    db.prepare(
      `
      INSERT INTO users (name, email, age)
      VALUES (?, ?, ?)
    `,
    ).run("Ahmad", "duplicate@example.com", 28);
  }).toThrow(/UNIQUE constraint failed/);

  // Verify only one record exists
  const result = db
    .prepare(
      `
    SELECT COUNT(*) AS total
    FROM users
    WHERE email = ?
  `,
    )
    .get("duplicate@example.com");

  expect(result.total).toBe(1);
});

test("Worker DB - update user age", async ({ db }) => {
  // Update Ali's age from 26 to 27
  db.prepare(
    `
    UPDATE users
    SET age = ?
    WHERE name = ?
  `,
  ).run(27, "Ali");

  // Retrieve updated user
  const user = db.prepare("SELECT * FROM users WHERE name = ?").get("Ali");

  // Verify updated value
  expect(user.age).toBe(27);
});

test("Worker DB - delete user", async ({ db }) => {
  // 1. Delete Ali's orders first
  db.prepare(
    `
    DELETE FROM orders
    WHERE user_id = (
      SELECT id FROM users WHERE name = ?
    )
  `,
  ).run("Ali");

  // 2. Delete Ali
  db.prepare(
    `
    DELETE FROM users
    WHERE name = ?
  `,
  ).run("Ali");

  // 3. Verify Ali no longer exists
  const user = db.prepare("SELECT * FROM users WHERE name = ?").get("Ali");

  expect(user).toBeUndefined();

  // 4. Verify only Siti remains
  const result = db.prepare("SELECT COUNT(*) AS total FROM users").get();

  expect(result.total).toBe(1);

  // 5. Verify Ali's order is also deleted
  const orders = db.prepare("SELECT * FROM orders").all();

  expect(orders).toHaveLength(1);
  expect(orders[0].product).toBe("Keyboard");
});

test("Worker DB - INNER JOIN users and orders", async ({ db }) => {
  const results = db
    .prepare(
      `
    SELECT
      users.name,
      orders.product,
      orders.amount
    FROM users
    INNER JOIN orders
      ON users.id = orders.user_id
    ORDER BY users.name ASC
  `,
    )
    .all();

  expect(results).toHaveLength(2);

  expect(results[0].name).toBe("Ali");
  expect(results[0].product).toBe("Laptop");
  expect(results[0].amount).toBe(2500);

  expect(results[1].name).toBe("Siti");
  expect(results[1].product).toBe("Keyboard");
  expect(results[1].amount).toBe(150);
});

test("Worker DB - LEFT JOIN users and orders", async ({ db }) => {
  // Delete Ali's order
  db.prepare(
    `
    DELETE FROM orders
    WHERE user_id = (
      SELECT id FROM users WHERE name = ?
    )
  `,
  ).run("Ali");

  // Get all users, including users without orders
  const results = db
    .prepare(
      `
    SELECT
      users.name,
      orders.product,
      orders.amount
    FROM users
    LEFT JOIN orders
      ON users.id = orders.user_id
    ORDER BY users.name ASC
  `,
    )
    .all();

  expect(results).toHaveLength(2);

  // Ali has no order
  expect(results[0].name).toBe("Ali");
  expect(results[0].product).toBeNull();
  expect(results[0].amount).toBeNull();

  // Siti has an order
  expect(results[1].name).toBe("Siti");
  expect(results[1].product).toBe("Keyboard");
  expect(results[1].amount).toBe(150);
});

test("Worker DB - GROUP BY user order count", async ({ db }) => {
  const results = db
    .prepare(
      `
    SELECT
      users.name,
      COUNT(orders.id) AS total_orders
    FROM users
    LEFT JOIN orders
      ON users.id = orders.user_id
    GROUP BY users.id, users.name
    ORDER BY users.name ASC
  `,
    )
    .all();

  expect(results).toHaveLength(2);

  expect(results[0].name).toBe("Ali");
  expect(results[0].total_orders).toBe(1);

  expect(results[1].name).toBe("Siti");
  expect(results[1].total_orders).toBe(1);
});

test("Worker DB - HAVING filter order count", async ({ db }) => {
  const results = db
    .prepare(
      `
    SELECT
      users.name,
      COUNT(orders.id) AS total_orders
    FROM users
    INNER JOIN orders
      ON users.id = orders.user_id
    GROUP BY users.id, users.name
    HAVING COUNT(orders.id) >= 1
    ORDER BY users.name ASC
  `,
    )
    .all();

  expect(results).toHaveLength(2);

  expect(results[0].name).toBe("Ali");
  expect(results[1].name).toBe("Siti");
});

test("Worker DB - aggregate functions", async ({ db }) => {
  const result = db
    .prepare(
      `
    SELECT
      SUM(amount) AS total_amount,
      AVG(amount) AS average_amount,
      MIN(amount) AS min_amount,
      MAX(amount) AS max_amount
    FROM orders
  `,
    )
    .get();

  expect(result.total_amount).toBe(2650);
  expect(result.average_amount).toBe(1325);
  expect(result.min_amount).toBe(150);
  expect(result.max_amount).toBe(2500);
});

test("Worker DB - verify user does not exist", async ({ db }) => {
  const user = db
    .prepare(
      `
    SELECT * FROM users
    WHERE name = ?
  `,
    )
    .get("Unknown");

  expect(user).toBeUndefined();
});

test("Worker DB - verify NULL values", async ({ db }) => {
  // Insert user with NULL age
  db.prepare(
    `
    INSERT INTO users (name, email, age)
    VALUES (?, ?, ?)
  `,
  ).run("Ahmad", "ahmad@example.com", null);

  const user = db
    .prepare(
      `
    SELECT * FROM users
    WHERE name = ?
  `,
    )
    .get("Ahmad");

  expect(user).toBeTruthy();
  expect(user.age).toBeNull();
});

test("Worker DB - parameterized search", async ({ db }) => {
  const searchUser = db.prepare(`
    SELECT * FROM users
    WHERE name = ?
  `);

  const ali = searchUser.get("Ali");
  const siti = searchUser.get("Siti");

  expect(ali).toBeTruthy();
  expect(ali.email).toBe("ali@example.com");

  expect(siti).toBeTruthy();
  expect(siti.email).toBe("siti@example.com");
});

test("Worker DB - prevent SQL injection", async ({ db }) => {
  const maliciousInput = "' OR 1=1 --";

  const user = db
    .prepare(
      `
    SELECT * FROM users
    WHERE name = ?
  `,
    )
    .get(maliciousInput);

  // Input dianggap sebagai nilai biasa, bukan arahan SQL
  expect(user).toBeUndefined();
});

test("Worker DB - prevent NULL name", async ({ db }) => {
  expect(() => {
    db.prepare(
      `
      INSERT INTO users (name, email, age)
      VALUES (?, ?, ?)
    `,
    ).run(null, "null@example.com", 25);
  }).toThrow(/NOT NULL constraint failed/);

  // Verify invalid record was not inserted
  const user = db
    .prepare(
      `
    SELECT * FROM users
    WHERE email = ?
  `,
    )
    .get("null@example.com");

  expect(user).toBeUndefined();
});

test("Worker DB - duplicate email should not change record count", async ({
  db,
}) => {
  const before = db.prepare("SELECT COUNT(*) AS total FROM users").get();

  expect(() => {
    db.prepare(
      `
      INSERT INTO users (name, email, age)
      VALUES (?, ?, ?)
    `,
    ).run("Ahmad", "ali@example.com", 28);
  }).toThrow(/UNIQUE constraint failed/);

  const after = db.prepare("SELECT COUNT(*) AS total FROM users").get();

  expect(after.total).toBe(before.total);
});

test("Worker DB - update only targeted user", async ({ db }) => {
  db.prepare(
    `
    UPDATE users
    SET age = ?
    WHERE name = ?
  `,
  ).run(35, "Ali");

  const ali = db
    .prepare(
      `
    SELECT * FROM users WHERE name = ?
  `,
    )
    .get("Ali");

  const siti = db
    .prepare(
      `
    SELECT * FROM users WHERE name = ?
  `,
    )
    .get("Siti");

  expect(ali.age).toBe(35);
  expect(siti.age).toBe(30);
});

test("Worker DB - update non-existing user", async ({ db }) => {
  const result = db
    .prepare(
      `
    UPDATE users
    SET age = ?
    WHERE name = ?
  `,
    )
    .run(50, "Unknown");

  // No record should be updated
  expect(result.changes).toBe(0);

  // Existing users remain unchanged
  const ali = db
    .prepare(
      `
    SELECT * FROM users WHERE name = ?
  `,
    )
    .get("Ali");

  const siti = db
    .prepare(
      `
    SELECT * FROM users WHERE name = ?
  `,
    )
    .get("Siti");

  expect(ali.age).toBe(26);
  expect(siti.age).toBe(30);
});

test("Worker DB - delete non-existing user", async ({ db }) => {
  const result = db
    .prepare(
      `
    DELETE FROM users
    WHERE name = ?
  `,
    )
    .run("Unknown");

  // No record should be deleted
  expect(result.changes).toBe(0);

  // Existing records remain unchanged
  const users = db
    .prepare(
      `
    SELECT * FROM users
    ORDER BY name ASC
  `,
    )
    .all();

  expect(users).toHaveLength(2);
  expect(users[0].name).toBe("Ali");
  expect(users[1].name).toBe("Siti");
});
test("Worker DB - transaction rollback multiple operations", async ({ db }) => {
  const transaction = db.transaction(() => {
    db.prepare(
      `
      INSERT INTO users (name, email, age)
      VALUES (?, ?, ?)
    `,
    ).run("Ahmad", "ahmad@example.com", 28);

    db.prepare(
      `
      UPDATE users
      SET age = ?
      WHERE name = ?
    `,
    ).run(99, "Ali");

    throw new Error("Force rollback");
  });

  expect(() => transaction()).toThrow("Force rollback");

  // Ahmad should not exist
  const ahmad = db
    .prepare(
      `
    SELECT * FROM users WHERE name = ?
  `,
    )
    .get("Ahmad");

  expect(ahmad).toBeUndefined();

  // Ali's age should remain unchanged
  const ali = db
    .prepare(
      `
    SELECT * FROM users WHERE name = ?
  `,
    )
    .get("Ali");

  expect(ali.age).toBe(26);
});
