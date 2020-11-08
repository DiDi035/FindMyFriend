const mongoose = require("mongoose");

const noticeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["admin", "order", "orderAccepted"],
    required: true,
  },
});

module.exports = mongoose.model("Notice", noticeSchema);
