const express = require("express");

const requiredLogIn = require("../middleware/RequiredLogin");
const Product = require("../database/models/Product");
const router = express.Router();

router.get("/:petId", requiredLogIn, (req, res) => {
  const { petId } = req.params;
  // const chosenPet = await Product.findById(petId);
  console.log(petId);
  res.render("product_view");
});

module.exports = router;
