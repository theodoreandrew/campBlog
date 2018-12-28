var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

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
router.post("/", function(req, res){
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
router.get("/new", function(req, res){
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
router.get("/:id/edit", function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	})
});

// PUT ROUTE
router.put("/:id", function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err){
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DELETE ROUTE
router.delete("/:id", function(req, res){
	Campground.findByIdAndDelete(req.params.id, function(err){
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;