const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const method_override = require("method-override");
const ejsMate = require("ejs-mate");

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
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(method_override("_method"));

app.get("/", async (req, res) => {
	const campground = await Campground.find({});
	res.render("home", { campground });
});
app.get("/campground", async (req, res) => {
	const campground = await Campground.find({});
	res.render("home", { campground });
});

app.get("/campground/new", async (req, res) => {
	res.render("new");
});
app.post("/campground", async (req, res) => {
	const camp = new Campground(req.body);
	await camp.save();
	res.redirect(`/campground/${camp._id}`);
});
app.get("/campground/:id", async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	res.render("show", { camp });
});
app.get("/campground/:id/edit", async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id);
	res.render("edit", { camp });
});

app.put("/campground/:id", async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findByIdAndUpdate(id, req.body);
	res.redirect("/campground");
});

app.delete("/campground/:id", async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	res.redirect("/campground");
});

app.listen(3000, () => {
	console.log("Welcome to new project");
});
