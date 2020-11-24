const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../database/models/User");
const requireLogin = require("../middleware/RequiredLogin");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("LogIn");
});
router.get("/register", (req, res) => {
  res.render("SignUp");
});

router.post("login", async (req, res) => {
  const { username, password } = req.body;
  const { valid, foundUser } = await User.isAuthenticated(username, password);
  if (valid) {
    req.session.user_id = foundUser._id;
    res.redirect("/home");
  } else {
    res.redirect("/auth/login");
  }
});
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  const user = new User({
    name: username,
    email: email,
    password: password,
  });
  res.redirect("/auth/login");
});
router.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/auth/login");
});

module.exports = router;
