var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment");
	// seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser : true});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
// seedDB();


app.get("/", function(req, res){
	res.render("homepage");
});

// INDEX ROUTE
app.get("/campgrounds", function(req, res){
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
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new"); 
});

// SHOW ROUTE
app.get("/campgrounds/:id", function(req, res){
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
app.get("/campgrounds/:id/edit", function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	})
});

// PUT ROUTE
app.put("/campgrounds/:id", function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err){
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DELETE ROUTE
app.delete("/campgrounds/:id", function(req, res){
	Campground.findByIdAndDelete(req.params.id, function(err){
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// ===========================
// COMMENT ROUTE
// ===========================

app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground : campground});
		}
	});
});

app.post("/campgrounds/:id/comments", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err) {
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

app.listen(3000, function(){
	console.log("YelpCamp server has started");
});