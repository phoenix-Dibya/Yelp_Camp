const { campgroundSchema, reviewSchema } = require("../schemas");
const Campground = require("../models/campground");

const ExpressError = require("../utils/ExpressError");
module.exports.isloggedin = (req, res, next) => {
    // console.log("Current user is: ", req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in to view");
        return res.redirect("/login");
    }
    next();
};
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map((e) => e.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    console.log(req.user);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You dont have permission to change the value");
        return res.redirect(`/campground/${id}`);
    }
    next();
};

module.exports.reviewValidate = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map((e) => e.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
