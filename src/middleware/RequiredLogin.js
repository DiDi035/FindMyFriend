const express = require("express");

const requiredLogIn = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/auth/welcome");
  }
  next();
};

<<<<<<< HEAD
module.exports = requiredLogIn;
=======
module.exports = requiredLogIn;
>>>>>>> b58308cad28c0b80d161c1a5f516cb3f4444f5d3
