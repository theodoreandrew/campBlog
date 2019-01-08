var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root route
router.get("/", function(req, res){
	res.render("homepage");
});

// Show register form
router.get("/register", function(req, res){
	res.render("register");
});

// Sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username : req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err) {
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

// Show Log In form
router.get("/login", function(req, res){
	res.render("login");
});

// Log In logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect : "/campgrounds",
		failureRedirect : "/login",
		failureFlash : {
			type : 'error',
			message : "Incorrect username or password"
		}
	}), function(req, res){
});

// Log Out logic
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Successfully logged you out!");
	res.redirect("/campgrounds");
})

module.exports = router;