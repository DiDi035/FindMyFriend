const express = require("express");
const bcrypt = require("bcrypt");

const requiredLogIn = require("../middleware/RequiredLogin");
const router = express.Router();

const User = require("../database/models/User");

router.get("/:userId/profile", requiredLogIn, async (req, res) => {
  const { userId } = req.params;
  const curUser = await User.findById(userId);
  res.render("ProfileView", { curUser, curUserType: "customer" });
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

router.put("/:userId/profile", async (req, res) => {
  const { username, password, email, address, tel } = req.body;
  const { userId } = req.params;
  await User.findByIdAndUpdate(userId, {
    name: username,
    password: await bcrypt.hash(password, 12),
    email: email,
    address: address,
    phone: tel,
  });
  res.redirect("/user/" + userId + "/profile");
});

module.exports = router;
