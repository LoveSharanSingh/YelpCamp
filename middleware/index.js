var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "CampGround not found");
            res.redirect("back");
        }else {
            
            //Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
            if (!foundCampground) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            //does user own the cg?
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }else {
                req.flash("error", "You dont have permission to do that");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "You need to be logged in!");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else {
            
            //Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
            if (!foundComment) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            
            //does user own the cg?
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }else {
                req.flash("error", "You dont have permission to do that");
                res.redirect("back");
            }
        }
    });
    } else {
        req.flash("error", "You need to be logged in!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "You need to be logged in!");
        res.redirect("/login");
    }
};

module.exports= middlewareObj;