const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");

const mainRouter = require("./routes/main");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const shopRouter = require("./routes/shop");
const path = require('path')

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

mongoose
  .connect("mongodb://localhost:27017/FindMyFriend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
<<<<<<< HEAD
    useCreateIndex:true,
=======
    
>>>>>>> b58308cad28c0b80d161c1a5f516cb3f4444f5d3
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
