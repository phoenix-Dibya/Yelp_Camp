const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const review = require("../controller/reviews");
const catchAsync = require("../utils/catchAsync");
const { isloggedin, reviewValidate } = require("../middleware/isloggedin");

router.post("/", isloggedin, reviewValidate, catchAsync(review.addReview));
router.delete("/:reviewid", isloggedin, catchAsync(review.deleteReviews));

module.exports = router;
