const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = Schema({
	image: String,
	title: String,
	price: Number,
	description: String,
	location: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
	],
});

CampgroundSchema.post("findOneAndDelete", async (campground) => {
	if (campground) {
		await Review.remove({
			_id: {
				$in: campground.reviews,
			},
		});
	}
});

module.exports = mongoose.model("Campground", CampgroundSchema);
