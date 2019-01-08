var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var NodeGeocoder = require("node-geocoder");

var options = {
	provider : 'google',
	httpAdapter : 'https',
	apiKey : process.env.GEOCODER_API_KEY,
	formatter : null
};

var geocoder = NodeGeocoder(options);

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

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new"); 
});

// POST ROUTE
router.post("/", middleware.isLoggedIn, function(req, res){
	var author = {
		id : req.user._id,
		username : req.user.username
	}
	req.body.campground.author = author;
	
	geocoder.geocode(req.body.location, function(err, data){
		if(!data || data.length <= 0){
			console.log(err);
			req.flash("error", "Invalid Location");
			return res.redirect("back");
		}
		req.body.campground.lat = data[0].latitude;
		req.body.campground.lng = data[0].longitude;
		req.body.campground.location = data[0].formattedAddress;
		Campground.create(req.body.campground, function(err, newCampgroundCreated){
			if(err){
				console.log(err);
			} else {
				// Redirect to campgrounds page
				res.redirect("/campgrounds");
			}
		});
	})

	// Create new element in a DB
	
});

// SHOW ROUTE
router.get("/:id", function(req, res){
	// Find the id of specific campground
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back")
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
	geocoder.geocode(req.body.location, function(err, data){
		if(!data || data.length <= 0){
			req.flash("error", "Invalid address");
			return res.redirect("back");
		}
		req.body.campground.lat = data[0].latitude;
		req.body.campground.lng = data[0].longitude;
		req.body.campground.location = data[0].formattedAddress;
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err){
			if(err) {
				res.redirect("back");
			} else {
				res.redirect("/campgrounds/" + req.params.id);
			}
		});
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