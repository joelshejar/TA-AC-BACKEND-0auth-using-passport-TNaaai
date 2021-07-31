var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
const Users = require('../models/Users');
var GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    let newUser = {
      firstname: profile.displayName.split(' ')[0],
      lastname: profile.displayName.split(' ').splice(1).join(' '),
      email: profile._json.email,
    };
    Users.findOne({ email: profile._json.email }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        Users.create(newUser, (err, addedUser) => {
          if (err) return done(err);
          console.log(addedUser)
          return done(null, addedUser);
        });
      }else{
         return done(null, user);
      }
    });
  }
));


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
      callbackURL: "/auth/google/callback",
    },
    function (request, accessToken, refreshToken, profile, done) {
      let newUser = {
        firstname: profile.displayName.split(' ')[0],
      lastname: profile.displayName.split(' ').splice(1).join(' '),
      email: profile._json.email,
      };
      Users.findOne({ email: profile.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          Users.create(newUser, (err, addedUser) => {
            if (err) return done(err);
            console.log(addedUser);
            return done(null, addedUser);
          });
        } else {
          return done(null, user);
        }
      });
    }
  )
);

passport.serializeUser((user, done)=>{
  done(null, user.id)
})

passport.deserializeUser((id, done)=>{
  Users.findById(id, (err, user)=>{
      done(err, user)
  })
})