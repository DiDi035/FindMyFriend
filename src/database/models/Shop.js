const mongoose = require("mongoose");
const validator = require("validator");

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

shopSchema.virtual("products", {
  ref: "Products",
  localField: "_id",
  foreignField: "owner",
});

shopSchema.statics.isAuthenticated = async function (shopUsername, password) {
  const foundedShop = await this.findOne({ name: shopUsername });
  let valid = false;
  if (foundedShop) {
    valid = await bcrypt.compare(password, foundedShop.password);
  }
  return {
    valid,
    foundUser,
  };
};

shopSchema.statics.findByCredentials = async (email,password) =>{
  const shop = await Shop.findOne({email})
  if (!shop) {
      throw new Error('Unable to login!')
  }

  const isMatched= await bcrypt.compare(password,shop.password)

  if (!isMatched){
      throw new Error('Unable to login')
  }
  return shop
}

shopSchema.methods.toJSON = function(){
  const shop= this
  shopObject = shop.toObject()
  delete shopObject.password
  delete shopObject.tokens
  return shopObject
}

shopSchema.pre('save', async function (next) {
  const shop = this
  if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

const Product = mongoose.model("Shop", shopSchema);

module.exports = Product;
