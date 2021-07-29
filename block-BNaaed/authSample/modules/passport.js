var passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;
const User = require("../models/User");

console.log(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

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



