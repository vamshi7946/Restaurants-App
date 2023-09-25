const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt'); // for hashing passwords
const db = require('../db'); // your database connection

// Define a route for user registration
Router.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);


  try {
    // Check if the email already exists in the database
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

    // Registration successful
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

module.exports = app;
