const express = require("express");

const requiredLogIn = require("../middleware/RequiredLogin");
const router = express.Router();

router.get("/home", requiredLogIn, (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/auth/login");
  }
  res.render("MainView");
});

module.exports = router;
