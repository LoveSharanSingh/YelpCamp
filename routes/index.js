var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//LANDING PAGE
router.get("/", function(req, res){
    res.render("campgrounds/landing");
});

// =============================
// AUTH ROUTES
// =============================

//show register form
router.get("/register", function(req,res){
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        } else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp "+user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

// Login Routes

router.get("/login", function(req, res){
   res.render("login"); 
});

//handling log in logic
router.post("/login",passport.authenticate("local", { //middleware
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;