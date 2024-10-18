// Required modules
const express = require('express');
const connection = require('./models/db'); // Assuming db connection is properly configured
const vehicleRoutes = require('./routes/vehicleRoutes');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

// Initialize the app
const app = express();
const port = process.env.PORT || 3000;

// Configure session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret', // Use an environment variable
  resave: false,
  saveUninitialized: false, // Don't save uninitialized sessions
  cookie: {
    httpOnly: true, // Helps prevent XSS
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 1000 * 60 * 60 * 24 // Cookie expiration time (1 day)
  }
}));

// Passport initialization middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for Passport.js (assumes 'auth.js' contains strategy setup)
require('./auth')(app);

// Route to test database connection
app.get('/test-db', (req, res) => {

  connection.query('SELECT 1 + 1 AS solution', (error, results) => {
    if (error) {
      return res.status(500).send('Database connection failed: ' + error);
    }
    res.send('Database connection successful! Result: ' + results[0].solution);

  });
});


// Authentication routes
app.get('/login', passport.authenticate('openidconnect', {
  scope: 'openid profile email'
}));

// Callback route for handling authentication result
app.get('/callback', passport.authenticate('openidconnect', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/');
});

// Logout route, redirecting to Auth0 logout URL
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect(`https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${process.env.BASE_URL}`);
  });
});

// Use the routes
app.use('/api/vehicles', vehicleRoutes);


// Home route, checking if user is authenticated and displaying profile info
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    // Log the user object to check what is available
    console.log("Authenticated user object:", req.user);

    // Extract user profile information with fallback checks
    const userProfile = req.user;
    const userEmail = userProfile.emails && userProfile.emails.length > 0 ? userProfile.emails[0].value : 'N/A';
    const userName = userProfile.displayName || userProfile.name?.givenName || 'User';
    
    // Display user profile information
    const userProfileHTML = `
      <h1>Hello, ${userName}</h1>
      <p><strong>Username:</strong> ${userProfile.name?.givenName || 'N/A'}</p>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p><strong>Contact Number:</strong> N/A</p>
      <p><strong>Country:</strong> N/A</p>
      <a href="/logout">Logout</a>
    `;
    res.send(userProfileHTML);
  } else {
    // User is not logged in, show login link
    res.send('<h1>Welcome!</h1><a href="/login">Login</a>');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

