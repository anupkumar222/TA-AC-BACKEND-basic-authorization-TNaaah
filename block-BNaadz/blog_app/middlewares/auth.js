var Users = require('../models/Users');

module.exports = {
    loggedInUser: (req, res, next) => {
        if(req.session && req.session.userId) {
            next();
        } else {
            res.redirect("/users")
        }
    },

    userInfo: (req, res, next) => {
        var userId = req.session && req.session.userId;
        if(userId) {
            Users.findById(userId, "name email", (err, user) => {
             if(err) return next(err);
             req.user = user;
             res.locals.user = user;
             next();
            })
        } else {
            req.user = null;
            res.locals.user = null;
            next();
        }
    },

    isSameUser: function(req, userId){
        var userId = req.session && req.session.userId;
        if(userId == userId){
            return true;
        }else{
            return false;
        }
    } 
}