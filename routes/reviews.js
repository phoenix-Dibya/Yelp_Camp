const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const { reviewSchema } = require("../schemas");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");

const reviewValidate = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);

	if (error) {
		const msg = error.details.map((e) => e.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

router.post(
	"/",
	reviewValidate,
	catchAsync(async (req, res, next) => {
		const campground = await Campground.findById(req.params.id);
		const review = await new Review(req.body.review);
		await review.save();
		campground.reviews.push(review);
		await campground.save();
		res.redirect(`/campground/${campground._id}`);
	})
);
router.delete(
	"/:reviewid",
	catchAsync(async (req, res) => {
		const { id, reviewid } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
		await Review.findByIdAndDelete(reviewid);
		res.redirect(`/campground/${id}`);
	})
);

module.exports = router;
