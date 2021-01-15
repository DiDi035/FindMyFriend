const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const requiredLogIn = require("../middleware/RequiredLogin");
const router = express.Router();

const User = require("../database/models/User");
const Shop = require("../database/models/Shop");
const { Notice } = require("../database/models/Notice");
const { Product } = require("../database/models/Product");

// Check if uploaded file type valid
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

router.get("/:userId/profile", requiredLogIn, async (req, res) => {
  const { userId } = req.params;
  const shop = req.shop;
  const user = req.user;
  res.render("ProfileViewCustomer", {
    user,
    shop,
  });
});

router.get("/:userId/cart", requiredLogIn, async (req, res) => {
  const { userId } = req.params;
  const shop = req.shop;
  const user = req.user;
  const chosenUserCart = user.cart.slice();
  let total = 0;
  for (let i = 0; i < chosenUserCart.length; ++i) {
    total += chosenUserCart[i].price;
  }
  res.render("BasketView", {
    user,
    shop,
    chosenUserCart,
    total,
  });
});

router.get("/:userId/noti", requiredLogIn, async (req, res) => {
  const shop = req.shop;
  const user = req.user;
  res.render("NotificationView", { user, shop });
});

router.post("/:petId/addToCart", requiredLogIn, async (req, res) => {
  const shop = req.shop;
  const user = req.user;
  const { petId } = req.params;
  const pet = await Product.findById(petId);
  user.cart.push(pet);
  await user.save();
  res.redirect("/product/" + petId);
});

router.post("/:userId/uploadAvatar", requiredLogIn, async (req, res) => {
  const { userId } = req.params;
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
      res.render("ProfileViewCustomer", {
        user,
        shop,
      });
    } else {
      if (req.file == undefined) {
        res.render("ProfileViewCustomer", {
          user,
          shop,
        });
      } else {
        const img = fs.readFileSync(req.file.path);
        const encodeImg = img.toString("base64");
        user.avatar = encodeImg;
        user.save();
        res.render("ProfileViewCustomer", {
          user,
          shop,
        });
      }
    }
  });
});

router.put("/:userId/profile", requiredLogIn, async (req, res) => {
  const shop = req.shop;
  const user = req.user;
  const { username, email, password, re_password } = req.body;
  user.name = username;
  user.email = email;
  if (re_password != "" && re_password == password) {
    user.password = await bcrypt.hash(password, 12);
  }
  user.save();
  res.redirect("/user/" + user._id + "/profile");
});

router.put("/:petId/removeCart", requiredLogIn, async (req, res) => {
  const shop = req.shop;
  const user = req.user;
  const { petId } = req.params;
  for (let i = 0; i < user.cart.length; ++i) {
    if (user.cart[i]._id == petId) {
      user.cart.splice(i, 1);
      break;
    }
  }
  await user.save();
  res.redirect("/user/" + user._id + "/cart");
});

router.put("/:userID/deleteNoti/:noticeIndex", async (req, res) => {
  const { userID, noticeIndex } = req.params;
  const userUpdate = await User.findById(userID);
  const index = parseInt(noticeIndex);
  userUpdate.notice.splice(index, 1);
  userUpdate.save();
  res.redirect("/user/" + userID + "/noti");
});

router.put("/:userId/purchase", requiredLogIn, async (req, res) => {
  const shop = req.shop;
  const user = req.user;
  for (let i = 0; i < user.cart.length; ++i) {
    let ownerID = user.cart[i].owner;
    let owner = await Shop.findById(ownerID);
    if (owner != null) {
      owner.notice.push(
        new Notice({
          name: "New order",
          detail:
            user.name +
            " want to buy " +
            user.cart[i].title +
            " from your shop",
          type: "order",
        })
      );
      owner.save();
    }
  }
  user.cart = [];
  user.save();
  res.redirect("/user/" + user._id + "/cart");
});

module.exports = router;
