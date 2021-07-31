var express = require('express');
var router = express.Router();
var passport = require('passport');
/* GET home page. */

router.get('/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/users/login",
  }),
  function (req, res) {
    res.redirect("/article");
  }
);


router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/users/login",
  }),
  function (req, res) {
    res.redirect("/article");
  }
);

module.exports = router;