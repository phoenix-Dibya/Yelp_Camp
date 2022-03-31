if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
console.log(process.env.cloudinary_cloud_name);
const express = require("express");
const router = express.Router();
const campground = require("../controller/campground");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const {
    isloggedin,
    validateCampground,
    isAuthor,
} = require("../middleware/isloggedin");

router
    .route("/")
    .get(campground.index)
    .post(
        isloggedin,
        upload.array("image"),
        validateCampground,
        catchAsync(campground.createNewCampground)
    );
// .post(upload.array("image"), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("IT WORKED");
// });
router.get("/campground", campground.index);

router.get("/new", isloggedin, campground.renderNewForm);

router
    .route("/:id")
    .get(isloggedin, catchAsync(campground.findCampground))
    .put(
        isloggedin,
        isAuthor,
        upload.array("image"),
        validateCampground,
        catchAsync(campground.updateCampground)
    )
    .delete(isAuthor, catchAsync(campground.deleteCampground));

router.get(
    "/:id/edit",
    isAuthor,
    isloggedin,
    catchAsync(campground.editCampground)
);

module.exports = router;
