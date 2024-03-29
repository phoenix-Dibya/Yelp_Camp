const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_300");
});
const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = Schema(
    {
        images: [ImageSchema],
        title: String,
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        price: Number,
        description: String,
        location: String,
        author: { type: Schema.Types.ObjectId, ref: "User" },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },
    opts
);

CampgroundSchema.virtual("properties.popUpMarkupText").get(function () {
    return `<a href = "/campground/${this._id}">${this.title}</a>`;
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
