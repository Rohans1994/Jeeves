const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
const nodemailer = require('nodemailer');

//Register form
router.get('/register', function (req, res) {
  res.render('register');
});

// Register Process
router.post('/register', function (req, res) {
  const { name, email, username, password, password2 } = req.body

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  let errors = req.validationErrors();
  if (errors) {
    res.render('register', {
      errors: errors
    });
  }
  else {
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: 'rohanapp@outlook.com',
        pass: 'pwd' //Changed due to security reasons
      }
    });

    const options = {
      from: 'rohanapp@outlook.com',
      to: `${email}`,
      subject: 'Email from Jeeves project',
      text: 'Welcome to the sample app'
    };

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function (err) {
          if (err) {
            console.log(err);
            return;
          }
          else {
            transporter.sendMail(options, function(err, info){
              if(err){
                console.log(err);
                return
              }
              console.log('Sent:' + info.response)
            })
            req.flash('success', 'You are now registered to login');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

//Login Form
router.get('/login', function (req, res) {
  res.render('login');
});

//Login Process
router.post('/login', function (req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//Logout Process
router.get('/logout', function (req, res) {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');

});
module.exports = router;
