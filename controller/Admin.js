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
    res.status(200).redirect("/admin/createproduct");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product creation failed !",
    });
  }
};

//update product
exports.updateProduct = async (req, res) => {
  try {
    const { _id, title, description, quantity, price } = req.body;
    const foundedproduct = await Product.findOne({ _id: _id });
    if (!foundedproduct) {
      return res.status(400).json({
        success: false,
        message: "Product not found !",
      });
    }
    const updated = await Product.findByIdAndUpdate(
      { _id: _id },
      {
        title: title,
        quantity: quantity,
        price: price,
        description: description,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully ✅",
      updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Product Updation failed !",
    });
  }
};
//delete product
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.body._id;
    const foundedproduct = await Product.findOne({ _id: id });
    if (!foundedproduct) {
      return res.status(400).json({
        success: false,
        message: "Product not found !",
      });
    }
    await Product.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully ✅",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Product Deletion failed !",
    });
  }
};
//get product
