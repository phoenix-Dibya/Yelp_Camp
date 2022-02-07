const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemas");
const ExpressError = require("../utils/ExpressError");

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
	catchAsync(async (req, res, next) => {
		console.log(req.body);
		const { error } = campgroundSchema.validate(req.body);

		if (error) {
			const msg = error.details.map((e) => e.message).join(",");
			throw new ExpressError(msg, 400);
		}
		console.log(error);
		const camp = new Campground(req.body.campground);
		await camp.save();
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
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const camp = await Campground.findByIdAndUpdate(id, req.body);
		res.redirect("/campground");
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
