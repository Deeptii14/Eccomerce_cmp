const express = require("express");
const { createProduct, getAllProducts } = require("../controller/Admin");
const router = express.Router();
router.get("/admin", (req, res) => {
  res.send("hello");
});
router.post("/createproduct", createProduct);
module.exports = router;
