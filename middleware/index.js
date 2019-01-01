var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {
	checkCampgroundOwnership : function (req, res, next){
		// Is user logged in
		if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(err, foundCampground){
				if(err) {
					res.redirect("back");
				} else {
					// Does the owner own the campground?
					if(foundCampground.author.id.equals(req.user._id)){
						next();
					} else {
						// Otherwise redirect
						res.redirect("back");
					}
				}
			}); 
		} else {
			// Otherwise redirect
			res.redirect("back");
		}
	},
	checkCommentOwnership : function(req, res, next){
		// Is user logged in
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err) {
					res.redirect("back");
				} else {
					// Does the owner own the comment?
					if(foundComment.author.id.equals(req.user._id)){
						next();
					} else {
						// Otherwise redirect
						res.redirect("back");
					}
				}
			}); 
		} else {
			// Otherwise redirect
			res.redirect("back");
		}
	},
	isLoggedIn : function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		res.redirect("/login");
	}
}

module.exports = middlewareObj;