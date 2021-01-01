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

const Notice = mongoose.model("Notice", noticeSchema);

module.exports = { Notice, noticeSchema };
