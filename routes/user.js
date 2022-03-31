const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const user = require("../controller/user");

router
    .route("/register")
    .get(user.registerUser)
    .post(catchAsync(user.renderloginUserForm));

router
    .route("/login")
    .get((req, res) => {
        res.render("users/login");
    })
    .post(
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "login",
        }),
        user.loginUser
    );

router.get("/logout", user.userLogout);
module.exports = router;
