const express = require("express");

const requiredLogIn = require("../middleware/RequiredLogin");
const Product = require("../database/models/Product");
const { options } = require("./auth");
const router = express.Router();

router.get("/:proId", async (req, res) => {
  const { proId } = req.params;
  // const chosenPet = await Product.findById(proId);
  res.render("product_view");
});

module.exports = router;
