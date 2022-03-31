const User = require("../models/user");
const passport = require("passport");

module.exports.registerUser = (req, res) => {
    res.render("users/register");
};

module.exports.renderloginUserForm = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            else {
                req.flash("success", "Welcome to Yelp Camp");
                res.redirect("/campground");
            }
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("register");
    }
};

module.exports.loginUser = (req, res) => {
    const redirectUrl = req.session.returnTo || "/campground";
    req.flash("success", "Welcome back");
    // delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/campground");
};
