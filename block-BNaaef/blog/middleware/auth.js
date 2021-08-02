const Article = require('../models/Article')
let Users = require('../models/Users')
let Comment = require('../models/Comment');
module.exports = {
    loggedInUser:(req, res, next)=> {
        if(req.session && req.session.userId) {
            next()
        }else if(req.session && req.session.passport){
           next()
        }else{
            console.log("auth")
            res.redirect('/users/login')
        }
    },
    userInfo: (req, res, next)=> {
        var userId = req.session && req.session.userId;
        var userpassport = req.session && req.session.passport;
        if(userId) {
            Users.findById(userId ,"email" ,  (err , user)=> {
                if(err) next(err)
                if (!req.session.passport) {
                    req.user = user;
                }
                res.locals.user = user;
                next();
            })
        }else if(userpassport) {
            Users.findById(userpassport.user ,  (err , user)=> {
                if(err) next(err)
                res.locals.user = user;
                next();
            })
        }
        else{
            req.user = null;
            res.locals.user = null;
            next();
        }
    },
    CommentInfo : (req, res, next)=> {
        Comment.findById(req.params.id, (err , content)=> {
            if(err) next(err) 
            console.log(content)
            if(content.userId.toString()=== req.user._id.toString()){
                next()
            }else{
                res.redirect('/users/login')
            }
        })
    }
}