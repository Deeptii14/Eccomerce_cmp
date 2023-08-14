const { default: mongoose } = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  photo: {
    type: String,
  },
});
module.exports = mongoose.model("Product", ProductSchema);
