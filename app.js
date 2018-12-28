var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user");
	// seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser : true});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret : "Chill out son !!",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground : campground});
		}
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

// =======================
// AUTHENTICATION ROUTE
// =======================

// Sign Up route
app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req, res){
	var newUser = new User({username : req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

// Log In route
app.get("/login", function(req, res){
	res.render("login")
});

app.post("/login", passport.authenticate("local", 
	{
		successRedirect : "/campgrounds",
		failureRedirect : "/login"
	}), function(req, res){
});

// Log Out route
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
})

// middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(3000, function(){
	console.log("YelpCamp server has started");
});