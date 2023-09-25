const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'vamshi',
  password: '1234',
  database: 'restaurant',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = db;
