const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://localhost:27017/FindMyFriend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb Connected !!!!!");
  })
  .catch((err) => {
    console.log("ERRORRRRRR!!");
    console.log(err);
  });

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log("Listening to port " + PORT);
});
