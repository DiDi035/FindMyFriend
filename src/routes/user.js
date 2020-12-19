const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const multer = require("multer");

const requiredLogIn = require("../middleware/RequiredLogin");
const router = express.Router();

const User = require("../database/models/User");

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
  const curUser = await User.findById(userId);
  res.render("ProfileView", { curUser, curUserType: "customer" });
});

router.get("/:userId/cart", requiredLogIn, async (req, res) => {
  const { userId } = req.params;
  const curUser = await User.findById(userId);
  // const chosenUserCart = chosenUser.cart.slice();
  const chosenUserCart = [
    {
      title: " Nhi Chihuahua",
      price: 100000,
    },
  ];
  res.render("BasketView", {
    chosenUserCart,
    curUser,
    curUserType: "customer",
  });
});

router.post("/:userId/uploadAvatar", async (req, res) => {
  const { userId } = req.params;
  const curUser = await User.findById(userId);
  const storage = multer.diskStorage({
    destination: "../public/upload",
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
  }).single("myImage");

  upload(req, res, (err) => {
    if (err) {
      res.render("upload", {
        curUser,
        curUserType: "customer",
        msg: err,
      });
    } else {
      if (req.file == undefined) {
        res.render("upload", {
          curUser,
          curUserType: "customer",
          msg: "ERROR: No file selected",
        });
      } else {
        // console.log(req.file.filename);
        const img = fs.readFileSync(req.file.path);
        const encodeImg = img.toString("base64");
        curUser.avatar = new Buffer(encodeImg, "base64");
        curUser.save();
        res.render("upload", {
          curUser,
          curUserType: "customer",
          msg: req.file.filename + " uploaded",
          ava: encodeImg,
        });
      }
    }
  });
});

router.put("/:userId/profile", async (req, res) => {
  const { username, password, email, address, tel } = req.body;
  const { userId } = req.params;
  await User.findByIdAndUpdate(userId, {
    name: username,
    password: await bcrypt.hash(password, 12),
    email: email,
    address: address,
    phone: tel,
  });
  res.redirect("/user/" + userId + "/profile");
});

module.exports = router;
