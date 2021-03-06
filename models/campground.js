var mongoose = require("mongoose");

// Design the schema
var campgroundSchema = mongoose.Schema({
	name : String,
	image : String,
	description : String,
	price : Number,
	lat : Number,
	lng : Number,
	location : String,
	dateCreated : {type : Date, default : Date.now},
	author : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username : String
	},
	comments : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Comment"
		}
	]
})

// Design model
module.exports = mongoose.model("Campground", campgroundSchema);