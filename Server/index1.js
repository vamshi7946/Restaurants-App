const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'vamshi',
    password: '1234',
    database: 'restaurant',
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
});

//3. Endpoint for filtering restaurants
app.get('/api/restaurants/filter', (req, res) => {
  const { cuisine , deliveryoptions} = req.query;

  // Build the SQL query dynamically based on the filter criteria
  let sql = 'SELECT * FROM restaurants where 1';

  if (cuisine) {
    sql += ` and cuisine = '${cuisine}'`;
  }
  if(deliveryoptions) {
    sql+=` and deliveryoptions ='${deliveryoptions}'`;
  }


  // Execute the SQL query to fetch filtered restaurants
  pool.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

// 6.Endpoint for searching restaurants
app.get('/api/restaurants/search', async (req, res) => {
  // Retrieve query parameters for searching
  const { keywords, cuisine, location } = req.query;

  try {
      // Construct a SQL query based on the search criteria
      let sql = 'SELECT * FROM Restaurants WHERE 1';

      if (keywords) {
          sql += ` AND (Name LIKE '%${keywords}%' OR Description LIKE '%${keywords}%')`;
      }

      if (cuisine) {
          sql += ` AND Cuisine = '${cuisine}'`;
      }

      if (location) {
          sql += ` AND Location = '${location}'`;
      }

      // Execute the query
      const [results] = await pool.query(sql);

      if (results.length === 0) {
          res.status(404).json({ error: 'No restaurants found matching the criteria' });
      } else {
          res.json(results);
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while searching for restaurants' });
  }
});

//7. Define the sorting endpoint
app.get('/api/restaurants/sort', (req, res) => {
    const { sortBy } = req.query;
  
    let orderBy = '';
  
    if (sortBy === 'rating') {
      orderBy = 'rating DESC';
    } else if (sortBy === 'delivery') {
      orderBy = 'deliveryoptions ASC';
    } else {
      return res.status(400).json({ error: 'Invalid sorting criteria' });
    }
  
    const sql = `SELECT * FROM restaurants ORDER BY ${orderBy}`;
  
    // Execute the SQL query to fetch sorted restaurants
    pool.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
  
      res.json(results);
    });
});
  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
