const Product = require("../models/Product");

//create product
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, quantity } = req.body;
    const photo = req.file.filename;
    const newprod = await Product.create({
      title: title,
      quantity: quantity,
      price: price,
      photo: photo,
      description: description,
    });
    res.status(200).json({ message: "product created " });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product creation failed !",
    });
  }
};

//update product

//delete product

//get product
