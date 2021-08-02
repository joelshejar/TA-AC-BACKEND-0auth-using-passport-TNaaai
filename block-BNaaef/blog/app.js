var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var Article = require('./models/Article');
var Users = require('./models/Users')
var Comment = require('./models/Comment');
var auth = require('./middleware/auth');

var session = require('express-session');
var flash  = require('connect-flash');
var MongoStore = require('connect-mongo');
var passport = require('passport');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var articleRouter = require("./routes/article");
var commentRouter = require('./routes/comment');
var authRouter = require('./routes/auth');

require('dotenv').config();


var mongoose = require('mongoose');
mongoose.connect(
  "mongodb://localhost/blog1",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log(err ? err : 'Connected to database');
  }
);

var app = express();

require('./modules/passport');

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));


app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/blog" }),
  })
);

app.use(passport.initialize())
app.use(passport.session())

app.use(flash());

app.use(auth.userInfo)


app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/article" , articleRouter);
app.use("/comment" , commentRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
// npm i passport-google-oauth2
// npm install node-sass-middleware
// npm i passport passport-github passport-google-oauth20
// npm i connect-mongo mongoose express-session bcrypt connect-flash dotenv --save