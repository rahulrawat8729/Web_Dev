// config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // 👈 your MySQL username
  password: 'Roh@n100', // 👈 replace with your MySQL password
  database: 'attendanceDB'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed: ' + err.message);
    return;
  }
  console.log('✅ Connected to MySQL database.');
});

module.exports = db;
