const mongoose = require("mongoose");
const Product = require("./Product");
const User = require("./User");

const orderSchema = mongoose.Schema({
  product: {
    type: [Product],
    default: [],
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: User,
    required: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);
