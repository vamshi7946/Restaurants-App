const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();
const cors = require('cors');
const { sendWelcomeEmail } = require('./email');
const { sendVerificationEmail } = require('./verification');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'vamshi',
    password: '1234',
    database: 'restaurant',
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0,
});
let verificationCode;

function generateVerificationCode() {
  // Generate a random 6-digit code
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/api', async (req, res) => {
  try {
    // Use async/await with the promise-based client
    const [rows] = await pool.query('SELECT * FROM restaurants');
    //console.log(rows)
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/restaurants/search', async (req, res) => {
  // Retrieve query parameters for searching
  try {
    // Construct a SQL query based on the search criteria
    const sql = `
      SELECT * 
      FROM Restaurants 
      WHERE Name LIKE ? OR Cuisine LIKE ? OR Location LIKE ?
    `;
    const queryKeyword = `%${req.query.keyword}%`;
    // Execute the query
    const [results] = await pool.query(sql, [queryKeyword, queryKeyword, queryKeyword]);

    if (results.length === 0) {
      res.status(404).json({ error: 'No restaurants found matching the criteria' });
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while searching for restaurants' });
  }
});


// 1.Endpoint for retrieving all restaurants or filtered and sorted restaurants
app.get('/api/restaurants', async (req, res) => {
    const query = req.query;
    const filters = [];
    const sortingOptions = [];

    if (query.cuisine) {
        filters.push(`Cuisine = '${query.cuisine}'`);
    }

    if (query.rating) {
        filters.push(`Rating >= ${query.rating}`);
    }

    if (query.address) {
        filters.push(`address = '${query.address}'`);
    }

    // Define sorting options based on the 'sort' query parameter
    if (query.sort) {
        const sortCriteria = query.sort.split(',');

        sortCriteria.forEach(criteria => {
            switch (criteria) {
                case 'name_asc':
                    sortingOptions.push('Name ASC');
                    break;
                case 'name_desc':
                    sortingOptions.push('Name DESC');
                    break;
                case 'rating_asc':
                    sortingOptions.push('Rating ASC');
                    break;
                case 'rating_desc':
                    sortingOptions.push('Rating DESC');
                    break;
                default:
                    break;
            }
        });
    }

    let sql = 'SELECT * FROM Restaurants';

    if (filters.length > 0) {
        sql += ' WHERE ' + filters.join(' AND ');
    }

    if (sortingOptions.length > 0) {
        sql += ` ORDER BY ${sortingOptions.join(', ')}`;
    }

    try {
        const [results] = await pool.query(sql);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching restaurants' });
    }
});

//3. Define the filtering endpoint
app.get('/api/restaurants/filter', async (req, res) => {
    try {
      const { cuisine, deliveryoptions } = req.query;
  
      // Build the SQL query dynamically based on the filter criteria
      let sql = 'SELECT * FROM restaurants WHERE 1';
      const params = [];
  
      if (cuisine) {
        sql += ' AND cuisine = ?';
        params.push(cuisine);
      }
      if (deliveryoptions) {
        sql += ' AND deliveryoptions = ?';
        params.push(deliveryoptions);
      }
  
      // Execute the SQL query with parameterized queries
      const [results] = await pool.query(sql, params);
      
      res.json(results);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
// Delete a restaurant and related data
app.delete('/api/edit', async (req, res) => {
  const data = req.body;
  const restaurantID=data.deleteRestaurant_id
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query('DELETE FROM restaurants WHERE restaurantID = ?', [restaurantID]);
    await connection.query('DELETE FROM reviews WHERE restaurantID = ?', [restaurantID]);
    await connection.query('DELETE FROM menuitems WHERE restaurantID = ?', [restaurantID]);
    await connection.query('DELETE FROM categories WHERE restaurantID = ?', [restaurantID]);
    await connection.commit();

    res.status(200).json({ message: 'Restaurant and related data deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    connection.release();
  }
});



//4.Endpoint for retrieving the menu of a specific restaurant
app.get('/api/restaurants/:restaurant_id/menu', async (req, res) => {
    const restaurantId = req.params.restaurant_id;

    try {
        // Query menu items and categories for the specific restaurant
        const [categoryResults] = await pool.query('SELECT * FROM Categories WHERE RestaurantID = ?', [restaurantId]);
        const [menuResults] = await pool.query('SELECT * FROM MenuItems WHERE RestaurantID = ?', [restaurantId]);

        if (!categoryResults || !menuResults) {
            return res.status(404).json({ error: 'No menu found for this restaurant' });
        }

        // Organize menu items by category
        const menu = {};
        categoryResults.forEach(category => {
            const categoryId = category.CategoryID;
            menu[categoryId] = {
                categoryName: category.CategoryName,
                items: menuResults.filter(item => item.CategoryID === categoryId).map(item => ({
                    name: item.Name,
                    description: item.Description,
                    price: item.Price
                }))
            };
        });

        res.json(menu);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the menu' });
    }
});

//5.Endpoint for retrieving restaurant reviews by restaurant ID
app.get('/api/restaurants/:restaurant_id/reviews', async (req, res) => {
    const restaurantId = req.params.restaurant_id;

    try {
        const [results] = await pool.query('SELECT rating,comment FROM Reviews WHERE RestaurantID = ?', [restaurantId]);

        if (results.length === 0) {
            res.status(404).json({ error: 'No reviews found for this restaurant' });
        } else {
            res.json(results);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching reviews' });
    }
});

// Endpoint for adding a review to a restaurant by ID
app.post('/api/restaurants/:restaurant_id/reviews', async (req, res) => {
  const id = req.params.restaurant_id;
  const { username,rating, comment } = req.body;
  // Insert the review into the reviews table
  const review = {
    RestaurantID: parseInt(id),
    CustomerName:username, // Use the correct parameter name
    Rating: parseInt(rating),
    Comment: comment,
  };

  const insertResult = await pool.query('INSERT INTO reviews SET ?', review);

  return res.status(201).json({ message: 'Review added successfully', review: { id: insertResult.insertId, ...review } });
});

//6.Endpoint for searching restaurants


//7. Define the sorting endpoint
app.get('/api/restaurants/sort', async (req, res) => {
    try {
      const { sortBy } = req.query;
  
      let orderBy = '';
  
      if (sortBy === 'rating') {
        orderBy = 'rating DESC';
      } else if (sortBy === 'delivery') {
        orderBy = 'deliveryoptions desc';
      } else {
        return res.status(400).json({ error: 'Invalid sorting criteria' });
      }
  
      const sql = `SELECT * FROM restaurants ORDER BY ${orderBy}`;
  
      // Execute the SQL query to fetch sorted restaurants
      const [results] = await pool.query(sql);
  
      res.json(results);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  });
  
//2. Endpoint for retrieving a single restaurant by ID
app.get('/api/restaurants/:restaurant_id', async (req, res) => {
    try {
        const restaurantId = req.params.restaurant_id;
        //console.log(restaurantId);
        // Check if the 'id' route parameter is provided
        if (!restaurantId) {
            return res.status(400).json({ error: 'Restaurant ID is required' });
        }

        // Build the SQL query to fetch the restaurant by ID with a parameterized query
        const sql = 'SELECT * FROM restaurants WHERE restaurantID = ?';
        const reviewsSql = 'SELECT * FROM reviews WHERE restaurantID = ?';
        const [reviewsRows] = await pool.query(reviewsSql, [restaurantId]);

        // Execute the SQL query with the parameter
        const [rows] = await pool.query(sql, [restaurantId]);
        const restaurantData = {
          restaurant: rows[0],
          reviews: reviewsRows,
      };
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        console.log(restaurantData)
        res.json(restaurantData); // Assuming there's only one restaurant with the given ID
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});


//8.Endpoint for retrieving restaurant details by restaurant ID
app.get('/api/restaurants/:restaurant_id/details', async (req, res) => {
    const restaurantId = req.params.restaurant_id;

    try {
        const [results] = await pool.query('SELECT RestaurantID,name,location,phone,rating,openhours,images FROM Restaurants WHERE RestaurantID = ?', [restaurantId]);
        const reviewsSql = 'SELECT * FROM reviews WHERE restaurantID = ?';
        const menuSql = 'select * from menuitems where restaurantID = ?';
        const [reviewsRows] = await pool.query(reviewsSql, [restaurantId]);
        const [menuRows] = await pool.query(menuSql, [restaurantId]);
        const restaurantData = {
          restaurant: results[0],
          reviews: reviewsRows,
          menuItems:menuRows
      };
        if (results.length === 0) {
            res.status(404).json({ error: 'Restaurant not found' });
        } else {
            res.json(restaurantData);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching restaurant details' });
    }
});


//9. Define an endpoint to retrieve restaurant images by restaurant ID
app.get('/api/restaurants/:restaurant_id/images', async (req, res) => {
    try {
        const restaurantId = req.params.restaurant_id;

        // Fetch image URLs for the given restaurant ID from the database
        const [results] = await pool.query('SELECT image_url FROM RestaurantImages WHERE restaurant_id = ?', [restaurantId]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'No images found for this restaurant' });
        }

        // Extract image URLs from the database results
        const imageUrls = results.map(result => result.image_url);

        // Return the image URLs as JSON
        res.json({ imageUrls });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching restaurant images' });
    }
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, email,password } = req.body;
    const saltRounds = 10; // Number of salt rounds (adjust as needed)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    verificationCode = generateVerificationCode();
    const connection = await pool.getConnection();
    const [maxIdRows] = await pool.query('SELECT MAX(userId) AS maxId FROM users');
    const maxId = maxIdRows[0].maxId || 0;
    const newUserId = maxId + 1;
    const [rows] = await connection.query('INSERT INTO users (userId, username,email, password, otp) VALUES (?, ?, ?, ?, ?)', [newUserId,username,email, hashedPassword,verificationCode]);
    connection.release();
    console.log(verificationCode);

    // Store the verification code in the database if needed

    // Send the verification email and wait for it to complete
    const result = await sendVerificationEmail(email, username, verificationCode);
    
    // If you have an actual email sending library, replace the timeout with actual email sending code
    res.status(200).json({ message: 'OTP sent successfully', email: email,username:username });
  } catch (error) {
    res.status(500).json({ error: 'Error sending OTP' });
  }
});


// Verify OTP and register user
app.post('/api/otp-confirmation', async (req, res) => {
  try {
    const { email,username, otp } = req.body;

    // Check if the provided OTP matches the one in the database
    const selectQuery = 'SELECT * FROM users WHERE email = ? AND otp = ?';
    const [rows] = await pool.query(selectQuery, [email, otp]);

    if (rows.length === 0) {
      // Invalid OTP
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Update the user as verified in the database
    const updateQuery = 'UPDATE users SET is_verified = ? WHERE email = ?';
    await pool.query(updateQuery, [true, email]);
    sendWelcomeEmail(email,username)
    // You can optionally send a success response message
    res.status(200).json({ message: 'OTP verification successful' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Error verifying OTP' });
  }
});

// Route to fetch and display cards from the database


// User login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Fetch user data from the database using email
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? and is_verified=1', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = rows[0];

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return res.status(200).json({  message: 'Login successful.',userId:user.userId, username:user.username});
    } else {
      return res.status(401).json({ message: 'Incorrect password.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

// Add this route inside your server.js file
app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  // Verify the reset token (You need to implement token verification logic)

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password in the database
  try {
    const connection = await pool.getConnection();
    await connection.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    connection.release();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// // Logout





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});