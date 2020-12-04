const express = require("express");

const requiredLogIn = require("../middleware/RequiredLogin");
const Product = require("../database/models/Product");
const router = express.Router();

router.get("/", requiredLogIn, (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/auth/login");
  }
  const allPets = Product.find();
  res.render("MainView", { allPets });
});

router.get("/:animal/:breed", requiredLogIn, async (req, res) => {
  const { animal, breed } = req.params;
  const chosenPets = await Product.find({ animal, breed });
  res.render("MainView", { chosenPets });
  // res.send(animal + " " + breed);
});

module.exports = router;
