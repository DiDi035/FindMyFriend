const express = require("express");

const requiredLogIn = require("../middleware/RequiredLogin");
const { Product } = require("../database/models/Product");
const User = require("../database/models/User");
const router = express.Router();

router.get("/customer/:page", requiredLogIn, async (req, res) => {
  const { page } = req.params;
  const pageNum = parseInt(page);
  const pets = await Product.find({ isHide: false });
  const pages = Math.trunc(pets.length / 9) + 1;
  let allPets = [];
  if ((pageNum - 1) * 9 < pets.length) {
    if ((pageNum - 1) * 9 + 8 < pets.length) {
      allPets = pets.slice((pageNum - 1) * 9, (pageNum - 1) * 9 + 9);
    } else {
      allPets = pets.slice((pageNum - 1) * 9, pets.length);
    }
  }
  const curUser = await User.findById(req.session.user_id);
  res.render("MainView", {
    allPets,
    pageNum,
    pages,
    breed: undefined,
    curUser,
    curUserType: "customer",
  });
});

router.get("/customer/:breed/:page", requiredLogIn, async (req, res) => {
  const { breed, page } = req.params;
  const pageNum = parseInt(page);
  const pets = await Product.find({ breed, isHide: false });
  const pages = Math.trunc(pets.length / 9) + 1;
  let allPets = [];
  if ((pageNum - 1) * 9 < pets.length) {
    if ((pageNum - 1) * 9 + 8 < pets.length) {
      allPets = pets.slice((pageNum - 1) * 9, (pageNum - 1) * 9 + 9);
    } else {
      allPets = pets.slice((pageNum - 1) * 9, pets.length);
    }
  }
  const curUser = await User.findById(req.session.user_id);
  res.render("MainView", {
    allPets,
    pageNum,
    pages,
    breed,
    curUser,
    curUserType: "customer",
  });
});

module.exports = router;
