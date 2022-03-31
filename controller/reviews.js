const Campground = require("../models/campground");
const Review = require("../models/review");
module.exports.addReview = async (req, res) => {
    console.log(req.params.id);
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campground/${campground._id}`);
};

module.exports.deleteReviews = async (req, res) => {
    const { id, reviewid } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campground/${id}`);
};
