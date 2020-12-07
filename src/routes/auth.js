const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../database/models/User");
const Shop = require("../database/models/Shop");
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
    res.redirect("/home");
  } else {
    res.redirect("/auth/customer/login");
  }
});

router.post("/shop/login", async (req, res) => {
  const { email, password } = req.body;
  const shop = await Shop.isAuthenticated(email, password);
  console.log(shop);
  if (!shop) {
    res.redirect("/auth/shop/login");
  } else {
    req.session.user_id = shop._id;
    req.session.type = "shop";
    res.redirect("/home");
  }
});

router.post("/register", async (req, res) => {
  const { username, password, email, type } = req.body;
  try {
    if (type == "customer") {
      console.log("vodayr");
      const user = new User({
        name: username,
        email: email,
        password: password,
      });
      await user.save();
      res.redirect("/auth/customer/login");
    } else if (type == "shop") {
      console.log("vodayr");
      const shop = new Shop({
        name: username,
        email: email,
        password: password,
      });
      await shop.save();
      res.redirect("/auth/shop/login");
    }
  } catch (e) {

    res.redirect("/auth/register")
  }
});

router.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.send("logout");
  // res.redirect("/auth//login");
});

module.exports = router;
