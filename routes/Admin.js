const express = require("express");
const {
  createProduct,
  deleteProduct,
  updateProduct,
  singleProduct,
} = require("../controller/Admin");
const { getAllProducts } = require("../controller/Auth");

const router = express.Router();
router.get("/admin", (req, res) => {
  res.send("hello");
});
router.post("/createproduct", createProduct);
router.get("/createproduct", (req, res) => {
  res.render("createProduct", { user: req.session.user });
});
router.get("/getallproduct", (req, res) => {
  res.render("AdminProduct", { user: req.session.user });
});
router.get("/getallproduct/:page", getAllProducts);
router.post("/delete", deleteProduct);

//update product
router.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  res.render("UpdateProduct", { user: req.session.user, product: id });
});

//get single product detail

router.get("/singleproduct/:id", singleProduct);
router.post("/update", updateProduct);
module.exports = router;
