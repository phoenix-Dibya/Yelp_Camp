const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");

const validateCampground = (req, res, next) => {
	
	const { error } = campgroundSchema.validate(req.body);

	if (error) {
		const msg = error.details.map((e) => e.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

router.get("", async (req, res) => {
	const campground = await Campground.find({});
	res.render("home", { campground });
});
router.get("/campground", async (req, res) => {
	const campground = await Campground.find({});
	res.render("home", { campground });
});

router.get("/new", async (req, res) => {
	res.render("new");
});

router.post(
	"/",
	validateCampground,
	catchAsync(async (req, res, next) => {
		const camp = new Campground(req.body.campground);
		await camp.save();
		req.flash("success", "Successfully made a new campground!!!");
		res.redirect(`/campground/${camp._id}`);
	})
);
router.get(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const camp = await Campground.findById(id).populate("reviews");
		res.render("show", { camp });
	})
);
router.get(
	"/:id/edit",
	catchAsync(async (req, res, next) => {
		const { id } = req.params;
		const camp = await Campground.findById(id);
		res.render("edit", { camp });
	})
);

router.put(
	"/:id",
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const camp = await Campground.findByIdAndUpdate(id, req.body);
		req.flash("success", "Successfully updated the campground!!!");
		res.redirect(`/campground/${camp._id}`);
	})
);
router.delete(
	"/:id",
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		res.redirect("/campground");
	})
);

module.exports = router;
