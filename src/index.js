const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");

const mainRouter = require("./routes/main");
const authRouter = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "notagoodsecret", resave: true, saveUninitialized: true })
);
app.use(express.static("public"))
app.use("/", mainRouter);
app.use("/auth", authRouter);

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

const PORT = 8000;
app.listen(PORT, () => {
  console.log("Listening to port " + PORT);
});
