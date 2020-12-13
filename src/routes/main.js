const express = require("express");

const {requiredLogIn,shopRequiredLogIn} = require("../middleware/RequiredLogin");
const Product = require("../database/models/Product");
const router = express.Router();

router.get("/", requiredLogIn, async (req, res) => {
  const allPets = await Product.find({ isHide: false });
  res.render("MainView", { allPets });
});

router.get("/:animal/:breed", requiredLogIn, async (req, res) => {
  const { animal, breed } = req.params;
  const allPets = await Product.find({ animal, breed });
  res.render("MainView", { allPets });
});

module.exports = router;
