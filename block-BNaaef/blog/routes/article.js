var express = require("express");
const { render } = require("../app");
var router = express.Router();
var Article = require("../models/Article");
var Comment = require("../models/Comment");
var Users = require("../models/Users");
var auth = require("../middleware/auth");

router.get("/", (req, res, next) => {
    console.log(req.user);
  var session = req.session.userId;
  Article.find({}, (err, content) => {
    if (err) next(err);
    Users.findById(session, (err, user) => {
      if (err) return next(err);
      return res.render("articles", {
        content,user
      });
    });
  });
});

router.get("/:id/detail", (req, res, next) => {
  var session = req.session.userId;
  Article.findById(req.params.id)
    .populate("comments")
    .exec((err, content) => {
      if (err) return next(err);
      res.render("detail", { data: content});
    });
});

router.use(auth.loggedInUser);

router.get("/new", (req, res, next) => {
  return res.render("newArticle");
});

router.post("/", (req, res, next) => {
  req.body.authorId = req.session.userId;
  Article.create(req.body, (err, content) => {
    if (err) return next(err);
    res.redirect("/article");
  });
});

router.get("/:slug/like", (req, res, next) => {
  let slug = req.params.slug;
  let id = req.session.userId;
  Article.findOne( {slug}, (err, content) => {
    console.log(content)
    if(content.likes.includes(id)) {
      content.likes.pull(id)
      content.save((err, content)=> {
        if(err) return next(err);
        res.redirect('/article/'+ content._id + '/detail');
      })
    }else{
       content.likes.push(id)
      content.save((err, content)=> {
        if(err) return next(err);
        res.redirect('/article/'+ content._id + '/detail');
      })
    }
  });
});


router.get("/:slug/edit", (req, res, next) => {
  console.log("hi")
    Article.findOne({ slug: req.params.slug }, (err, content) => {
    if (err) return next(err);
    if (content.authorId._id.toString() === req.user._id.toString()) {
      res.render("editArticle", { data: content });
    } else {
      res.redirect("/users/login");
    }
  });




});

router.post("/:slug/edit", (req, res, next) => {
  console.log("hi")
  Article.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    { new: true },
    (err, content) => {
      if (err) return next(err);
      console.log(content);
      res.redirect("/article/" + content.slug);
    }
  );
});

router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Article.findById(id, (err, content) => {
    if (err) return next(err);
    if (content.authorId._id.toString() === req.user._id.toString()) {
      Article.findByIdAndDelete(id, (err, content) => {
        if (err) return next(err);
        Comment.deleteMany({ articleId: id }, (err, content) => {
          if (err) return next(err);
          console.log(content);
          res.redirect("/article");
        });
      });
    } else {
      res.redirect("/users/login");
    }
  });
});

router.post("/:id/comment", (req, res, next) => {
  req.body.aticleId = req.params.id;
  req.body.userId = req.user._id;
  Comment.create(req.body, (err, content) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: content._id } },
      (err, article) => {
        if (err) return next(err);
        res.redirect("/article/" + article.slug);
      }
    );
  });
});

router.get("/:slug", (req, res, next) => {
  var slug = req.params.slug;
  var session = req.session.userId;
  Article.findOne({ slug })
    .populate("comments")
    .exec((err, content) => {
      if (err) return next(err);
      res.render("detail", { data: content, session });
    });
});

module.exports = router;