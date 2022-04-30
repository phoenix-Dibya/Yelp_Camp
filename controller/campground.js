const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");
const mbxClient = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCode = mbxClient({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
    const campground = await Campground.find({});
    res.render("home", { campground });
};

module.exports.renderNewForm = async (req, res) => {
    res.render("new");
};

module.exports.createNewCampground = async (req, res, next) => {
    const geoData = await geoCode
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send();
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save();
    req.flash("success", "Successfully made a new campground!!!");
    res.redirect(`/campground/${camp._id}`);
};

module.exports.findCampground = async (req, res) => {
    const { id } = req.params;
    // console.log(`Campground Id is ${id}`);
    const camp = await Campground.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("author");

    if (!camp) {
        req.flash("error", "Cannot find campground!!!");
        return res.redirect("/campground");
    }
    res.render("show", { camp });
};

module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("edit", { camp });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground);
    camp.images.push(...imgs);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
        console.log("deleted images");
        console.log(camp);
    }
    req.flash("success", "Successfully updated the campground!!!");
    res.redirect(`/campground/${camp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campground");
};
