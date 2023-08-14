const mongoose = require("mongoose");
const tokenschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, expires: "30m", default: Date.now },
});
module.exports = mongoose.model("Token", tokenschema);
