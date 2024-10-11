// Required modules
const express = require('express');
const connection = require('./models/db'); // Assuming db connection is properly configured
const passport = require('passport');
require('dotenv').config();

// Initialize the app
const app = express();
const port = process.env.PORT || 3000;

// Middleware for Passport.js (assumes 'auth.js' contains strategy setup)
require('./auth')(app);

// Route to test database connection
app.get('/test-db', (req, res) => {
  // Simple test query to check database connection
  connection.query('SELECT 1 + 1 AS solution', (error, results) => {
    if (error) {
      // Error handling
      res.status(500).send('Database connection failed: ' + error);
    } else {
      // Success: send result
      res.send('Database connection successful! Result: ' + results[0].solution);
    }
  });
});

// Authentication routes
app.get('/login', passport.authenticate('openidconnect'));

// Callback route for handling authentication result
app.get('/callback', passport.authenticate('openidconnect', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication: redirect to the homepage
        res.redirect('/');
    }
);

// Logout route, redirecting to Auth0 logout URL
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { 
      return next(err); 
    }
    // Redirect to Auth0 logout and then return to your app
    res.redirect(`https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${process.env.BASE_URL}`);
  });
});

// Home route, checking if user is authenticated
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        // User is logged in, display their name and a logout link
        res.send(`<h1>Hello, ${req.user.name}</h1><a href="/logout">Logout</a>`);
    } else {
        // User is not logged in, show login link
        res.send('<h1>Welcome!</h1><a href="/login">Login</a>');
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret', // Use an environment variable
  resave: false,
  saveUninitialized: false, // Don't save uninitialized sessions
  cookie: {
    httpOnly: true, // Helps prevent XSS
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 // Cookie expiration time (1 day)
  }
}));
