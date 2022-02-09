const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const campgroundRouter = require("./routes/campground");
const reviewRouter = require("./routes/reviews");
const method_override = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const flash = require("connect-flash");

mongoose
	.connect("mongodb://localhost:27017/yelp-camp", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Mongoose connection established...");
	})
	.catch((e) => {
		console.log("Error while connecting to mongoose database" + e.message);
	});

const db = mongoose.connection;
db.on("error", console.error.bind(console.log("Connection error")));
db.once("open", () => {
	console.log("Database connected!!");
});

const sessionConfig = {
	secret: "thisisagoodsecret",
	resave: true,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(method_override("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	next();
});

app.use("/", campgroundRouter);
app.use("/campground", campgroundRouter);
app.use("/campground/:id/review", reviewRouter);

app.all("*", (req, res, next) => {
	throw new ExpressError("Page not found", 404);
});

app.use((err, req, res, next) => {
	const { message = "Something went wrong", status = 500 } = err;
	console.log(err.message);
	res.status(status).render("error", { err });
});

app.listen(3000, () => {
	console.log("Welcome to new project");
});
