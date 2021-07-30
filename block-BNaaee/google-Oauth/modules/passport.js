var passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;
const User = require("../models/User");
var GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
      callbackURL: "/auth/google/callback",
    },
    function (request, accessToken, refreshToken, profile, done) {
      let newUser = {
        name: profile.displayName,
        email: profile.email,
        imageUrl: profile._json.picture,
      };
      User.findOne({ email: profile.email }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          User.create(newUser, (err, addedUser) => {
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


passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/github/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        let newUser = {
          name: profile.displayName,
          username: profile.username,
          imageurl: profile._json.avatar_url,
          email: profile._json.email,
        };
        User.findOne({ email: profile._json.email }, (err, user) => {
          if (err) return done(err);
          if (!user) {
            User.create(newUser, (err, addedUser) => {
              if (err) return done(err);
              console.log(addedUser)
              return done(null, addedUser);
            });
          }else{
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
      User.findById(id, "name email username", (err, user)=>{
          done(err, user)
      })
  })