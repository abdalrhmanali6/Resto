// db.js
const sql = require('mssql');
require('dotenv').config();
const config = {
  user: process.env.user_DB, // your login
  password: process.env.password_DB, // your password
  server: 'localhost', // default instance
  database: "Restaurant", // your database
  options: {
    encrypt: false,
    trustServerCertificate: true,
     instanceName: 'SQLEXPRESS'
  },
};

async function connectDB() {
  try {
    const pool = await sql.connect(config);
    console.log("✅ Connected to SQL Server");
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    throw err;
  }
}

module.exports = { sql, connectDB };
