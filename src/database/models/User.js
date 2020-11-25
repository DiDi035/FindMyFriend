const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    default: "none",
  },
  type: {
    type: String,
    enum: ["customer", "shop", "admin"],
  },
});

userSchema.statics.isAuthenticated = async function (username, password) {
  const foundUser = await this.findOne({ name: username });
  let valid = false;
  if (foundUser) {
    valid = await bcrypt.compare(password, foundUser.password);
  }
  return {
    valid,
    foundUser,
  };
};

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
