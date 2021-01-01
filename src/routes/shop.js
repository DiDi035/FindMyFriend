const Shop = require("../database/models/Shop");

const express = require("express");
const Product = require("../database/models/Product");
const requireLogin = require("../middleware/RequiredLogin");

const router = new express.Router();
const multer = require("multer");
const { stringify } = require("uuid");

router.get("/:shopName", async (req, res) => {
  const match = {};
  const limit = 10;
  const skip = 0;
  const sort = {};

  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }

  if (req.query.skip) {
    limit = parseInt(req.query.skip);
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = part[1] === "desc" ? -1 : 1;
  }
  try {
    await req.shop
      .populate({
        path: "products",
        match,
        options: {
          limit,
          skip,
          sort,
        },
      })
      .execPopulate();

    res.send(res.shop.products);
  } catch (e) {
    res.status(500).send();
  }
});

// upload product's image
const upload = multer({
  limits: {
    files: 10,
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      console.log("check ");
      return cb(new Error("Please upload images!"));
    }
    cb(undefined, true);
  },
});

//add products
router.post(
  "/addProduct",
  requireLogin,
  upload.array("images"),
  async (req, res) => {
    const product = new Product({
      ...req.body,
      owner: req.shop._id,
    });
    const files = req.files;
    temp = [];
    console.log(files.length);
    for (i = 0; i < files.length; i++) {
      files[i].res;
      temp.push(files[i].buffer);
    }
    product.images = temp;
    try {
      await product.save();
      res.status(201).send();
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.get("/:shopName/addNewProduct", requireLogin, async (req, res) => {
  const shop = req.shop;
  res.render("ProductViewForOwner", { shop });
});

router.get("/:shopName/ownProducts", requireLogin, async (req, res) => {
  const shop = req.shop;
  const user = req.user;
  const match = {};
  const limit = 10;
  const skip = 0;
  const sort = {};
  const page = 0;

  if (req.query.page) {
    page = parseInt(req.query.page)-1;
  }

  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }

  if (req.query.skip) {
    skip = parseInt(req.query.skip);
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = part[1] === "desc" ? -1 : 1;
  }

  try {
    await req.shop
      .populate({
        path: "products",
        match,
        options: {
          limit,
          skip,
          sort,
        },
      })
      .execPopulate();
    console.log(req.shop.products);
    const products = req.shop.products
    res.render("ShopDetailOwnerView", { shop, user, products, page });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
