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
    connectionLimit: 20,
    queueLimit: 0,
});
let verificationCode;

function generateVerificationCode() {
  // Generate a random 6-digit code
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


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


app.get('/api/restaurants/1/html-page', (req, res) => {
    // Set the Content-Type header to indicate that you're sending HTML.
    res.setHeader('Content-Type', 'text/html');
  
    // Define your HTML content.
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title> Restaurant A</title>
        </head>
        <body>
          <h1>Restaurant A</h1>
          <p>Welcome to our restaurant</p>
          <img src="https://assets.traveltriangle.com/blog/wp-content/uploads/2017/10/Flechazo.jpg"/>
          <img src="https://imgmedia.lbb.in/media/2022/12/6399ab61e46d7d6c99f89400_1671015265356.jpg"/>
          <img src="https://i0.wp.com/stanzaliving.wpcomstaging.com/wp-content/uploads/2022/04/a566a-restaurants-in-hyderabad.jpg?fit=1000%2C750&ssl=1"/>
        </body>
      </html>
    `;
  
    // Send the HTML content as the response.
    res.send(htmlContent);
  });


  app.get('/api/restaurants/2/html-page', (req, res) => {
    // Set the Content-Type header to indicate that you're sending HTML.
    res.setHeader('Content-Type', 'text/html');
  
    // Define your HTML content.
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title> Restaurant B</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        </head>
        <body>
          <h1 class='text-center'>Restaurant B</h1>
          <p class='text-center'>Welcome to our restaurant</p>
          <div class='d-flex flex-row justify-content-center mb-4'>
          <img  class='mx-2' src="https://www.dineout.co.in/blog/wp-content/uploads/2017/03/Olive-Bistro-700x400.jpg"/>
          <img  src="https://www.shoutlo.com/uploads/articles/header-img-are-you-in-love-with-rooftop-restaurant-azure-check-out-hyderabads-famous-rooftop-restaurants.jpg"/>
          </div>
          <div class='d-flex flex-row justify-content-center'>
          <img  class='mx-2'src="https://assets.traveltriangle.com/blog/wp-content/uploads/2017/10/Exotica.jpg"/>
          <img  src="https://images.venuebookingz.com/26740-1636624111-wm-bel-post-cafe-jubilee-hills-hyderabad-1.jpg"/>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        </body>
      </html>
    `;
  
    // Send the HTML content as the response.
    res.send(htmlContent);
  });

  app.get('/api/restaurants/3/html-page', (req, res) => {
    // Set the Content-Type header to indicate that you're sending HTML.
    res.setHeader('Content-Type', 'text/html');
  
    // Define your HTML content.
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title> Restaurant C</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        </head>
        <body>
          <h1 class='text-center'>Restaurant C</h1>
          <p class='text-center'>Welcome to our restaurant</p>
          <div class='pl-4'>
          <div class='d-flex flex-row justify-content-center mb-4'>
          <img  class='mx-3'src="https://www.ramojifilmcity.com/images/images/things-todo-restaurants-gal1.jpg"/>
          <img  src="https://www.ramojifilmcity.com/images/images/restuarants-things-todo.jpg"/>
          </div>
          <div class='d-flex flex-row justify-content-center'>
          <img  class='mx-2'src="https://www.ramojifilmcity.com/images/images/things-todo-restaurants-gal4.jpg"/>
          <img  src="https://ak-d.tripcdn.com/images/02272120009sy3sy3E48E_R_800_525.jpg"/>
          </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        </body>
      </html>
    `;
  
    // Send the HTML content as the response.
    res.send(htmlContent);
  });

  app.get('/api/restaurants/4/html-page', (req, res) => {
    // Set the Content-Type header to indicate that you're sending HTML.
    res.setHeader('Content-Type', 'text/html');
  
    // Define your HTML content.
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title> Restaurant D</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        </head>
        <body>
          <h1 class='text-center'>Restaurant D</h1>
          <p class='text-center'>Welcome to our restaurant</p>
          <div
          <div class='d-flex flex-row justify-content-center'>
          <img  class='mx-2'src="https://imgmedia.lbb.in/media/2023/08/64d37c36a8a4940ea79350ec_1691581494379.jpg"/>
          <img  src="https://b.zmtcdn.com/data/pictures/9/90299/5bbf57c2bbcc0b28e0ae2cb14af04c70.jpg?fit=around|750:500&crop=750:500;*,*"/>
          </div>
          <div class='d-flex flex-row justify-content-center mb-4'>
          <img  class='mx-2' src="https://b.zmtcdn.com/data/pictures/6/96626/.jpg"/>
          <img  src="https://www.ramojifilmcity.com/images/images/restuarants-things-todo.jpg"/>
          </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        </body>
      </html>
    `;
  
    // Send the HTML content as the response.
    res.send(htmlContent);
  });
//6.Endpoint for searching restaurants
app.get('/api/restaurants/search', async (req, res) => {
    // Retrieve query parameters for searching
    const { keywords, cuisine, location } = req.query;
  
    try {
        // Construct a SQL query based on the search criteria
        let sql = 'SELECT * FROM Restaurants WHERE 1';
  
        if (keywords) {
            sql += ` AND (Name LIKE '%${keywords}%' or cuisine like '%${keywords}%')`;
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

        // Execute the SQL query with the parameter
        const [rows] = await pool.query(sql, [restaurantId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.json(rows[0]); // Assuming there's only one restaurant with the given ID
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

//8.Endpoint for retrieving restaurant details by restaurant ID
app.get('/api/restaurants/:restaurant_id/details', async (req, res) => {
    const restaurantId = req.params.restaurant_id;

    try {
        const [results] = await pool.query('SELECT name,location,phone,rating,openhours FROM Restaurants WHERE RestaurantID = ?', [restaurantId]);

        if (results.length === 0) {
            res.status(404).json({ error: 'Restaurant not found' });
        } else {
            res.json(results[0]);
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


// app.post('/api/register', async (req, res) => {
//   const { username,email, password } = req.body;
  
//   try {
//     // Generate a salt and hash the user's password
//     const saltRounds = 10; // Number of salt rounds (adjust as needed)
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const connection = await pool.getConnection();
//     const [rows] = await connection.query('INSERT INTO users (username,email, password) VALUES (?, ?, ?)', [username,email, hashedPassword]);
//     connection.release();
//     sendWelcomeEmail(email,username);
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Error inserting data:', error);
//     res.status(500).json({ error: 'Error inserting data' });
//   }
// });


// Send an OTP email

app.post('/api/register', async (req, res) => {
  try {
    const { username, email,password } = req.body;
    const saltRounds = 10; // Number of salt rounds (adjust as needed)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    verificationCode = generateVerificationCode();
    const connection = await pool.getConnection();
    const [rows] = await connection.query('INSERT INTO users (username,email, password, otp) VALUES (?, ?, ?, ?)', [username,email, hashedPassword,verificationCode]);
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
      return res.status(200).json({  message: 'Login successful.',username:user.username});
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