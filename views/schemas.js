const Joi = require("joi");
module.exports.campgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required(),
		price: Joi.number().min(0).required(),
		location: Joi.string().required(),
		image: Joi.string().required(),
		description: Joi.string().required(),
	}).required(),
});

module.exports.reviewSchema = Joi.object({
	reviews: Joi.object({
		rating: Joi.number().required(),
		body: Joi.string().required(),
	}).required(),
});