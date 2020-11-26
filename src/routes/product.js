const express = require("express");

const requiredLogIn = require("../middleware/RequiredLogin");
const Product = require("../database/models/Product");
const router = express.Router();

router.get("/:proId", (req, res) => {
  const { proId } = req.params;
  // const chosenPet = await Product.findById(petId);
  res.render("product_view");
});

module.exports = router;
