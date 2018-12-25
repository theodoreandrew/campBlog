var mongoose = require("mongoose");

// Design the schema
var campgroundSchema = mongoose.Schema({
	name : String,
	image : String,
	description : String,
	comments : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Comment"
		}
	]
})

// Design model
module.exports = mongoose.model("Campground", campgroundSchema);