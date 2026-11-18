const db = require("./db");

// Reset existing test data
db.prepare("DELETE FROM users").run();

// Insert fresh test data
const insertUser = db.prepare(`
  INSERT INTO users (name, email, age)
  VALUES (?, ?, ?)
`);

const seedUsers = db.transaction(() => {
  insertUser.run("Ali", "ali@example.com", 26);
  insertUser.run("Siti", "siti@example.com", 30);
  insertUser.run("Ahmad", "ahmad@example.com", 28);
});

seedUsers();

console.log("Database seeded successfully!");

console.table(db.prepare("SELECT * FROM users").all());

db.close();
