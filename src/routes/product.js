const express = require("express");

const requiredLogIn = require("../middleware/RequiredLogin");
const Product = require("../database/models/Product");
const Shop = require("../database/models/Shop");
const { options } = require("./auth");
const router = express.Router();
const multer = require("multer");

router.get("/:proId", async (req, res) => {
  const { proId } = req.params;
  pet = {};
  shop = {};
  try {
    pet = await Product.findById(proId);
    shop = await Shop.findById(pet.owner);
  } catch (e) {
    res.status(404).send();
  }
  res.render("ProductView", { pet, shop });
});



module.exports = router;
