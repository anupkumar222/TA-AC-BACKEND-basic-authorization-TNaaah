var express = require('express');
var Users = require('../models/Users');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("login", { error : req.flash("error")[0]});
});

router.get("/register", (req, res, next) => {
  // console.log(error);
  res.render('register', { error: req.flash("error")[0]})
})

router.post('/register', (req, res, next) => {
  Users.create(req.body, (err, user) => {
    if(err) {
      if(err.name === 'MongoServerError') {
        req.flash('error', 'This email is taken');
       return res.redirect('/users/register');
      }  
      if(err.name === "ValidationError") {
        req.flash('error', err.message);
      return  res.redirect('/users/register');
      }
      return res.json({ err })
    }
    console.log(err, user);
    res.redirect('/users');
  })
})

router.post('/login', (req, res, next) => {
  var { email, password} = req.body;
  if(!email || !password) {
    req.flash('error', 'Email/Password is not registered');
  return res.redirect('/users');
  }

  Users.findOne({ email }, (err, user) => {
    if(err) return next(err);
    if(!user) {
      req.flash('error', 'This email is not registerd');
     return res.redirect('/users');
    }
    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result) {
        req.flash('error', 'Incorrect Password');
       return res.redirect('/users')
      }
      req.session.userId = user.id;
      res.redirect('/articles')
    })
  })
})

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;
