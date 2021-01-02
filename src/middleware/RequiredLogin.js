const express = require("express");
const User = require("../database/models/User");
const Shop = require("../database/models/Shop");

const requiredLogIn = async (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/auth/welcome");
  } else {
    _id = req.session.user_id;
    const user = await User.findById(_id);
    const shop = await Shop.findById(_id);
    req.user = user;
    req.shop = shop;
    next();
    if (!user && !shop) {
      return res.redirect("/auth/welcome");
    }
  }
};

// const shopRequiredLogIn = async (req, res, next) => {
//   try {
//     if (!req.session.shop_id) {
//       throw new Error();
//     }
//     _id = req.session.shop_id;
//     const shop = await Shop.findById(_id);
//     req.shop = shop;
//     next();
//   } catch (e) {
//     return res.redirect("/auth/welcome");
//   }
// };

module.exports = requiredLogIn;
