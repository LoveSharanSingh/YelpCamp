var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//INDEX - SHOWS ALL CAMPGROUNDS
router.get("/campgrounds", function(req,res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campGrounds: allCampgrounds});
        }
    });
});

//NEW - SHOWS FORM TO ADD NEW CAMPGROUND
router.get("/campgrounds/new",middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

//SHOW - SHOWS MORE INFO ABOUT CAMPGROUNDS
router.get("/campgrounds/:id", function(req, res){
    //find a cg with id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            console.log("error finding the camp by id");
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campGround: foundCamp});
        }
    });
});


//CREATE - CREATES A NEW CAMPGROUND
router.post("/campgrounds",middleware.isLoggedIn, function(req, res){
    //get data from user about camp
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampGround = {name: name, image: image, price: price, desc:desc, author: author};
    Campground.create(newCampGround, function(err, newlyCrated){
        if(err){
            console.log(err);
        }else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//  edit campground route
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err){
            res.send(err);
        } else {
        res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//  update campground route
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req,res){
    //find and update the correct cg
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCg){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/"+req.params.id);
       }
    });
    //redirect to the show page
});

// destroy campground route
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
    });
    res.redirect("/campgrounds");
});


module.exports = router;