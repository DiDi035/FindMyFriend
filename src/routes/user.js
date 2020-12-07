const express = require("express");

const requiredLogIn = require("../middleware/RequiredLogin");
const router = express.Router();

const User = require("../database/models/User");

router.get("/user/:userId/profile", requiredLogIn, (req, res) => {
  const { userId } = req.params;
  const chosenUser = User.findById(userId);
  res.render("ProfileView", { chosenUser });
});

router.get("/user/:userId/cart", requiredLogIn, (req, res) => {
  const { userId } = req.params;
  const chosenUser = User.findById(userId);
  res.render("BasketView", { userId });
});

module.exports = router;
