var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX ROUTE
router.get("/", function(req, res){
	// Find the DB and display it
	Campground.find({}, function(err, wholeCampgrounds){
		if(err){
			console.log(err);
		} else {
			// Go to campgrounds page and show all campgrounds
			res.render("campgrounds/index", {campData : wholeCampgrounds});
		}
	});
});

// POST ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
	var author = {
		id : req.user._id,
		username : req.user.username
	}
	req.body.campground.author = author
	// Create new element in a DB
	Campground.create(req.body.campground, function(err, newCampgroundCreated){
		if(err){
			console.log(err);
		} else {
			// Redirect to campgroounds page
			res.redirect("/campgrounds");
		}
	});
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new"); 
});

// SHOW ROUTE
router.get("/:id", function(req, res){
	// Find the id of specific campground
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			// Get the info and display it
			res.render("campgrounds/show", {campgroundInfo : foundCampground});
		}
	});
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

// UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err){
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndDelete(req.params.id, function(err){
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;