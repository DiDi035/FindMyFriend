const express = require("express");

<<<<<<< HEAD
router.get('/upload',)
=======
const requiredLogIn = require("../middleware/RequiredLogin");
const Product = require("../database/models/Product");
const router = express.Router();

router.get("/:proId", (req, res) => {
  const { proId } = req.params;
  // const chosenPet = await Product.findById(petId);
  res.render("product_view");
});

module.exports = router;
>>>>>>> 41ad48bacd757cbd4255ba1b6f9f23e8fff12274
