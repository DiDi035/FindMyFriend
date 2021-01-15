const express = require("express");
const requiredLogIn = require("../middleware/RequiredLogin");
const { Product } = require("../database/models/Product");
const Shop = require("../database/models/Shop");
const { options } = require("./auth");
const router = express.Router();
const multer = require("multer");

router.get("/:proId", requiredLogIn, async (req, res) => {
  const { proId } = req.params;
  const user = req.user;
  const shop = req.shop;
  try {
    pet = await Product.findById(proId);
    owner = await Shop.findById(pet.owner);
    res.render("ProductView", { pet, owner, user, shop });
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
