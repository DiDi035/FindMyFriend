const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: Buffer,
  },
  contact: {
    type: String,
    default: "none",
  },
  email: {
    type: String,
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
    default: "none",
  },
  isHide: {
    type: Boolean,
    required: true,
    default: false,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

shopSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "owner",
});

shopSchema.statics.isAuthenticated = async function (username, password) {
  const shop = await this.findOne({ email: username });
  if (!shop) {
    console.log("email not found");
    return new Error("Unable to login!");
  }

  const isMatched = await bcrypt.compare(password, shop.password);
  if (!isMatched) {
    console.log("incorrect password");
    return new Error("Unable to login");
  }
  return shop;
};

shopSchema.methods.toJSON = function () {
  const shop = this;
  shopObject = shop.toObject();
  delete shopObject.password;
  return shopObject;
};

shopSchema.pre("save", async function (next) {
  const shop = this;
  if (shop.isModified("password")) {
    shop.password = await bcrypt.hash(shop.password, 12);
  }
  next();
});

const Shop = mongoose.model("Shop", shopSchema);

Shop.collection.createIndex({ name: 1 }, { unique: true });
Shop.collection.createIndex({ email: 1 }, { unique: true });
Shop.collection.createIndex({ contact: 1 }, { unique: true });
module.exports = Shop;
