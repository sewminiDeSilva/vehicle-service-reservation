const session = require('express-session');
const passport = require('passport');
const OpenIDConnectStrategy = require('passport-openidconnect').Strategy;
require('dotenv').config();

// OpenID Connect Strategy
passport.use(new OpenIDConnectStrategy({
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  authorizationURL: `https://${process.env.AUTH0_DOMAIN}/authorize`,
  tokenURL: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
  userInfoURL: `https://${process.env.AUTH0_DOMAIN}/userinfo`,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/callback`,
  scope: 'openid profile email',
},


function (issuer, profile, done) {
  console.log('Profile received:', profile);
  // Return profile on success
  return done(null, profile);
}));

// Passport serialization logic
passport.serializeUser((user, done) => {
  done(null, user);  // Store the user object in the session
});

passport.deserializeUser((user, done) => {
  done(null, user);  // Retrieve the user object from the session
});

// Export session and passport configuration
module.exports = (app) => {
  app.use(session({ 
    secret: process.env.SESSION_SECRET || 'your_secret', // Use environment variables for security
    resave: false,
    saveUninitialized: false, // Prevent uninitialized sessions
    cookie: {
      httpOnly: true,  // Prevent client-side JavaScript from accessing the cookie
      secure: false,  // Set to true if you're using HTTPS
      maxAge: 1000 * 60 * 60 * 24  // Set session expiry time (1 day)
    }
  }));

  // Initialize passport and session
  app.use(passport.initialize());
  app.use(passport.session());
};
