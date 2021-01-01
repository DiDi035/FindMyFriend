const express = require("express");

const requiredLogIn = require("../middleware/RequiredLogin");
const Product = require("../database/models/Product");
const router = express.Router();

router.get("/", requiredLogIn, async (req, res) => {
  const allPets = await Product.find({ isHide: false });
  const shop = req.shop;
  const user = req.user;
  
  res.render("MainView", { allPets, shop, user });
});

router.get("/:animal/:breed", requiredLogIn, async (req, res) => {
  const { animal, breed } = req.params;
  const allPets = await Product.find({ animal, breed });
  const shop = req.shop;
  const user = req.user;
  res.render("MainView", { allPets, shop, user });
});

module.exports = router;
