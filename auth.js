const session = require('express-session');
const passport = require('passport');
const OpenIDConnectStrategy = require('passport-openidconnect').Strategy;
require('dotenv').config();

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
function (issuer, sub, profile, accessToken, refreshToken, done) {
  console.log('Profile received:', profile);
  if (profile) {
    return done(null, profile);  // Successful authentication
  } else {
    return done(new Error('Profile not found')); // Provide error feedback
  }
}));

passport.serializeUser((user, done) => {
    done(null, user);  // Store the user object in the session
});

passport.deserializeUser((user, done) => {
    done(null, user);  // Retrieve the user object from the session
});

module.exports = (app) => {
    app.use(session({ 
        secret: process.env.SESSION_SECRET || 'your_secret',
        resave: false,
        saveUninitialized: false, // Change to false
        cookie: {
            httpOnly: true,
            secure: false, // Set to true in production
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};
