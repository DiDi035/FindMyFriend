const express = require("express");

const requiredLogIn = require("../middleware/RequiredLogin");
const router = express.Router();

const User = require("../database/models/User");

router.get("/:userId/profile", requiredLogIn, async (req, res) => {
  const { userId } = req.params;
  const chosenUser = await User.findById(userId);
  res.render("ProfileView", { chosenUser });
});

router.get("/:userId/cart", requiredLogIn, async (req, res) => {
  const { userId } = req.params;
  const chosenUser = await User.findById(userId);
  // const chosenUserCart = chosenUser.cart.slice();
  const chosenUserCart = [
    {
      title: " Nhi Chihuahua",
      price: 100000,
    },
  ];
  res.render("BasketView", { chosenUserCart, chosenUser });
});

module.exports = router;
