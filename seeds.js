var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name : "Wonderland",
        image : "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f5c479a7ebbdbf_340.jpg",
        description : "This is what we called paradise man !!!"
    },
    {
        name : "Crabby Paradise",
        image : "https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104491f5c479a7ebbdbf_340.jpg",
        description : "Hell yeah boy. This is Nature!!"
    },
    {
        name : "SpongeBob Camping Site",
        image : "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg",
        description : "SpongeBob Square Pants !!!!!"
    }
];

function seedDB(){
	//Remove all campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds!");
		Comment.remove({}, function(err) {
			if(err){
				console.log(err);
			}
			console.log("removed comments!");
			  //add a few campgrounds
			data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if(err){
						console.log(err);
					} else {
						console.log("added a campground");
						//create a comment
						Comment.create(
							{
								text: "This place is great, but I wish there was internet",
								author: "Homer"
							}, function(err, comment){
								if(err){
									console.log(err);
								} else {
									campground.comments.push(comment);
									campground.save();
									console.log("Created new comment");
								}
							});
					}
				});
			});
		});
	}); 
	//add a few comments
}

module.exports = seedDB;