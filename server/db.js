// db.js
import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mypassword',
  database: "recipes"
});

console.log("Connected to MySQL");

// server/index.js
