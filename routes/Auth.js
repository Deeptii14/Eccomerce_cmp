const express = require("express");
const {
  createUser,
  loginUser,
  logout,
  Loginget,
  Signupget,
  getAllProducts,
} = require("../controller/Auth");

const router = express.Router();

router.get("/login", Loginget);
router.post("/login", loginUser);
router.get("/signup", Signupget);
router.post("/signup", createUser);

router.get("/logout", logout);

router.get("/getproduct/:page", getAllProducts);

module.exports = router;
