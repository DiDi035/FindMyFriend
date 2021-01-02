const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

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
    const {
        userId
    } = req.params;
    const shop = req.shop;
    const user = req.user;
    res.render("ProfileViewCustomer", {
        user,
        shop
    });
});

router.get("/:userId/cart", requiredLogIn, async (req, res) => {
    const {
        userId
    } = req.params;
    const shop = req.shop;
    const user = req.user;
    const chosenUserCart = user.cart.slice();
    res.render("BasketView", {
        user,
        shop,
        chosenUserCart
    });
});

router.get("/userId/noti", requiredLogIn, async (req, res) => {

});

router.post("/:userId/uploadAvatar", async (req, res) => {
    const {
        userId
    } = req.params;
    const curUser = await User.findById(userId);
    const storage = multer.diskStorage({
        destination: "../src/public/upload",
        filename: function(req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now());
        },
    });

    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 10000000,
        },
        fileFilter: function(req, file, cb) {
            checkFileType(file, cb);
        },
    }).single("fileAva");

    upload(req, res, (err) => {
        if (err) {
            res.render("ProfileView", {
                curUser,
                curUserType: "customer",
                msg: err,
            });
        } else {
            if (req.file == undefined) {
                res.render("ProfileView", {
                    curUser,
                    curUserType: "customer",
                    msg: "ERROR: No file selected",
                });
            } else {
                const img = fs.readFileSync(req.file.path);
                const encodeImg = img.toString("base64");
                curUser.avatar = encodeImg;
                curUser.save();
                res.render("ProfileView", {
                    curUser,
                    curUserType: "customer",
                    msg: req.file.filename + " uploaded",
                });
            }
        }
    });
});

router.put("/:userId/profile", async (req, res) => {
    const {
        username,
        password,
        email,
        address,
        tel
    } = req.body;
    const {
        userId
    } = req.params;
    const userUpdate = await User.findById(userId);
    userUpdate.name = username;
    userUpdate.email = email;
    userUpdate.address = address;
    userUpdate.phone = tel;
    // const valid = await bcrypt.compare(password, userUpdate.password);
    // if (!valid) {
    //   userUpdate.password = await bcrypt.hash(password, 12);
    // }
    userUpdate.save();
    res.redirect("/user/" + userId + "/profile");
});

module.exports = router;