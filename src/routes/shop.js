const Shop = require("../database/models/Shop");
const express = require("express");
const { Product } = require("../database/models/Product");
const requireLogin = require("../middleware/RequiredLogin");

const router = new express.Router();
const multer = require("multer");
const { stringify } = require("uuid");

const checkFileType = (file, cb) => {
  const fileType = /jpeg|jpg|png|gif/;
  const extName = fileType.test(path.extname(file.originalname));
  const mimeType = fileType.test(file.mimetype);
  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("ERROR: This file is not an image");
  }
};

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

// upload product's images
const upload = multer({
  limits: {
    files: 10,
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      console.log("check");
      return cb(new Error("Please upload images!"));
    }
    cb(undefined, true);
  },
});

// //add products
// router.post(
//   "/addProduct",
//   requireLogin,
//   upload.array("images"),
//   async (req, res) => {
//     const product = new Product({
//       ...req.body,
//       owner: req.shop._id,
//     });
//     const files = req.files;
//     temp = [];
//     console.log(files.length);
//     for (i = 0; i < files.length; i++) {
//       files[i].res;
//       temp.push(files[i].buffer);
//     }
//     product.images = temp;
//     try {
//       await product.save();
//       res.status(201).send();
//     } catch (e) {
//       res.status(400).send(e);
//     }
//   }
// );

router.get("/:shopName/addNewProduct", requireLogin, async (req, res) => {
  const shop = req.shop;
  const user = req.user;
  product = undefined;
  res.render("ProductViewForOwner", { shop, user, product });
});

router.get("/:shopId/noti", requireLogin, async (req, res) => {
  const shop = req.shop;
  const user = req.user;
  res.render("NotificationView", { user, shop });
});

router.post(
  "/:shopName/addNewProduct",
  requireLogin,
  upload.array("images"),
  async (req, res) => {
    const shop = req.shop;
    const user = req.user;

    const files = req.files;
    temp = [];

    for (let i = 0; i < files.length; i++) {
      temp.push(files[i].buffer);
    }
    try {
      const product = new Product({
        ...req.body,
        owner: shop._id,
        images: temp,
      });
      console.log(product);
      await product.save();
    } catch (e) {
      res.status(500).send();
    }
    const url = "/shop" + "/" + shop.name + "/ownProducts";
    res.redirect(url);
  }
);

router.get(
  "/:shopName/editProduct/:productId",
  requireLogin,
  async (req, res) => {
    const shop = req.shop;
    const user = req.user;
    const _id = req.params.productId;
    try {
      const product = await Product.findById({ _id });
      if (!product) {
        return res.status(404).send();
      }
      console.log(product);
      res.render("ProductViewForOwner", { shop, user, product });
    } catch (e) {
      res.status(500).send();
    }
  }
);

router.post(
  "/:shopName/editProduct/:productId",
  requireLogin,
  upload.array("images"),
  async (req, res) => {
    const shop = req.shop;
    const user = req.user;
    updates = Object.keys(req.body);
    const _id = req.params.productId;
    const files = req.files;
    try {
      const product = await Product.findById({ _id });
      if (!product) {
        res.status(404).send();
      }
      updates.forEach((update) => (product[update] = req.body[update]));
      if (files.length != 0) {
        for (let i = 0; i < files.length; i++) {
          product.images.push(files[i].buffer);
        }
      }
      await product.save();
    } catch (e) {
      res.status(500).send();
    }
    const url = "/shop" + "/" + shop.name + "/ownProducts";
    res.redirect(url);
  }
);

router.get("/:shopName/editProfile", requireLogin, async (req, res) => {
  const shop = req.shop;
  const user = req.user;
  res.render("ProfileView", { shop, user });
});

router.post("/:shopName/editProfile", requireLogin, async (req, res) => {
  const shop = req.shop;
  const user = req.user;

  res.render("ProfileView", { shop, user });
});

router.post("/:shopName/uploadAvatar", requireLogin, async (req, res) => {
  const { shopName } = req.params;
  const shop = req.shop;
  const user = req.user;
  const storage = multer.diskStorage({
    destination: "../src/public/upload",
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 10000000,
    },
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).single("fileAva");

  upload(req, res, (err) => {
    if (err) {
      res.render("ProfileView", {
        user,
        shop,
      });
    } else {
      if (req.file == undefined) {
        res.render("ProfileView", {
          user,
          shop,
        });
      } else {
        const img = fs.readFileSync(req.file.path);
        const encodeImg = img.toString("base64");
        user.avatar = encodeImg;
        user.save();
        res.render("ProfileView", {
          user,
          shop,
        });
      }
    }
  });
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
    page = parseInt(req.query.page) - 1;
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
    const products = req.shop.products;
    res.render("ShopDetailOwnerView", { shop, user, products, page });
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/:shopName/delete", requireLogin, async (req, res) => {
  const shop = req.shop;
  const user = req.user;
  try {
    await req.shop.remove();
    res.send(req.shop);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
