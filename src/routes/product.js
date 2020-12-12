const express = require("express");

const requiredLogIn = require("../middleware/RequiredLogin");
const Product = require("../database/models/Product");
const router = express.Router();

router.get("/:proId", requiredLogIn, async (req, res) => {
  const { proId } = req.params;
  // const chosenPet = await Product.findById(proId);
  res.render("ProductView", { curUserId: req.session.user_id });
});

module.exports = router;
