const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../database/models/User");
const Shop = require("../database/models/Shop");
const { Notice } = require("../database/models/Notice");
const requireLogin = require("../middleware/RequiredLogin");

const router = express.Router();

router.get("/welcome", (req, res) => {
    res.render("WelcomePage");
});

router.get("/customer/login", (req, res) => {
    res.render("log_in");
});

router.get("/shop/login", (req, res) => {
    res.render("LogInForShop");
});
router.get("/register", (req, res) => {
    res.render("SignUp");
});

router.post("/customer/login", async (req, res) => {
    const { username, password } = req.body;
    const { valid, foundUser } = await User.isAuthenticated(username, password);
    if (valid) {
        req.session.user_id = foundUser._id;
        res.redirect("/home/1");
    } else {
        res.redirect("/auth/customer/login");
    }
});

router.post("/shop/login", async (req, res) => {
    const { username, password } = req.body;
    const shop = await Shop.isAuthenticated(username, password);
    if (!shop) {
        res.redirect("/auth/shop/login");
    } else {
        req.session.user_id = shop._id;
        res.redirect("/home/1");
    }
});

router.post("/register", async (req, res) => {
  const { username, password, email, type } = req.body;
  try {
    if (type == "customer") {
      const user = new User({
        name: username,
        email: email,
        password: await bcrypt.hash(password, 12),
        notice: new Notice({
                    name: "Welcome",
                    detail: "Welcome to Find my friend community - a special thanks from admin",
                    type: "admin"
                })
      });
      await user.save();
      res.redirect("/auth/customer/login");
    } else if (type == "shop") {
      const shop = new Shop({
        name: username,
        email: email,
        password: password,
        avatar: undefined,
        notice: new Notice({
                    name: "Welcome",
                    detail: "Welcome to Find my friend community - a special thanks from admin",
                    type: "admin"
                })
      });
      await shop.save();
      res.redirect("/auth/shop/login");
    }
});

router.get("/logout", (req, res) => {
    req.session.user_id = null;
    res.render("WelcomePage");
});

module.exports = router;