var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
// console.log(User);
/* Register route. */
router.get('/register', function(req, res, next) {
    res.render('register');
});

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/register', function(req, res, next) {
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    
    //validation
    req.checkBody('name', 'Name is Reuiires').notEmpty();
    req.checkBody('username', 'USername is Reuiires').notEmpty();
    req.checkBody('email', 'email is Reuiires').isEmail();
    req.checkBody('password', 'Password is Reuiires').notEmpty();
    req.checkBody('password2', 'password do not match').equals(req.body.password);
    var errors = req.validationErrors();
    if(errors){
        res.render('register',{
            errors: errors
        });
    }else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        User.createUser(newUser, function (err, user) {
           if(err)throw err;
            // console.log(user);
        });
        req.flash('success_msg', 'You are registerd and can log in');
        res.redirect('/users/login');
    }
});


passport.use(new LocalStrategy(
    function(username, password, done) {console.log("i invoked");
        User.getUserByusername(username, function (err, user) {
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown user'});
            }
            console.log(username);
            User.comparePassword(password, user.password, function (err, isMatch) {
                if(err) {
                    console.log('err: -' + err);
                    // throw err;
                    }
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});



//login
router.post('/login',
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
            function (req,res) {
                res.redirect('/');
                req.flash('You Are Logged In');
            });

router.get('/logout', function (req,res) {
    req.logout();
    req.flash('sucess_msg', 'you are logged out');
    res.redirect('/users/login');
});

module.exports = router;
/**
 * Created by lt-48 on 1/6/16.
 */
