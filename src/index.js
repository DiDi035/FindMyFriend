const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require('path')

const mainRouter = require("./routes/main");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const shopRouter = require("./routes/shop");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "notagoodsecret", resave: true, saveUninitialized: true })
);

app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));


app.use("/home", mainRouter);
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/shop", shopRouter);
app.use("/user", userRouter);

mongoose
  .connect("mongodb://localhost:27017/FindMyFriend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
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
