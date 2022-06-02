if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const campgroundRouter = require("./routes/campground");
const reviewRouter = require("./routes/reviews");
const method_override = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const db_url = process.env.atlas_url || "mongodb://localhost:27017/yelp-camp";
const secret = process.env.SECRET || "thisisagoodsecret";
const store = MongoStore.create({
    secret: secret,
    mongoUrl: db_url,
    touchAfter: 24 * 60 * 60,
});
// mongodb://localhost:27017/yelp-camp
mongoose
    .connect(db_url, {
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
    store: store,
    secret: secret,
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
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/fakeUser", async (req, res) => {
    const user = new User({ email: "abcd@gmail.com", username: "abcd" });
    const newUser = await User.register(user, "abcd");
    res.send(newUser);
});

// app.use("/", userRouter);
app.use("/", userRouter);
app.use("/campground", campgroundRouter);
app.use("/campground/:id/review", reviewRouter);

app.get("/", (req, res) => {
    res.render("home1"); //for homepage
});

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
