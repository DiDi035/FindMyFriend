const mongoose = require("mongoose");
const { Product } = require("./database/models/Product");

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

const dataProduct = [
  {
    title: "Cho Nam",
    animal: "Dog",
    breed: "Chihuahua",
    gender: "Female",
    color: "Pink",
    month: 2,
    isHide: false,
    isPurchase: false,
    price: 1000000,
  },
];

Product.insertMany(dataProduct, { ordered: false })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
