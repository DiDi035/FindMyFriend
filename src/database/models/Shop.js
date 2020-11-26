const mongoose = require("mongoose");
const validator = require("validator");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: Buffer,
  },
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  isHide: {
    type: Boolean,
    required: true,
    default: false,
  },
  isPurchase: {
    type: Boolean,
    required: true,
    default: false,
  },
  image: [{ type: String }],
});

productSchema.virtual("products", {
  ref: "Products",
  localField: "_id",
  foreignField: "owner",
});

const Product = mongoose.model("Shop", productSchema);

module.exports = Product;
