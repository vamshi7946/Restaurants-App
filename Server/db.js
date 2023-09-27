const mysql = require('mysql/promise');

const pool = mysql.createConnection({
  host: 'localhost',
  user: 'vamshi',
  password: '1234',
  database: 'restaurant',
});

pool.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = pool;
