const User = require("../models/User");
const bcrypt = require("bcrypt");
const { sendemail } = require("../utlis/mailSend");
const Product = require("../models/Product");
//user signup post
exports.createUser = async (req, res) => {
  const { email, name, password } = req.body;
  let hashpassword = await bcrypt.hash(password, 10);
  const user = {
    email: email,
    name: name,
    password: hashpassword,
    profilepic: req.file.filename,
  };
  //save user to DB
  try {
    const alreadyExist = await User.findOne({ email: email });
    if (alreadyExist) {
      res.render("signup", { error: "User already exists. Go to login" });
    } else {
      const addeduser = await User.create(user);
      const link = `http://localhost:8000/verifyemail/${addeduser._id}`;

      //send mail to user account
      const mailresult = await sendemail(
        email,
        "Verify your email",
        link,
        `<h1>Verify Your email Account </h1><br><a href=${link}>Click here</a>`
      );
      console.log("Mail result :", mailresult);
      if (!addeduser) {
        res.status(400).json({
          message: "Something went wrong while creating account",
        });
      }
      res.render("login", { error: "Account created Successfully!" });
    }
  } catch (error) {
    return res.status(500).json({
      error: error,
      message: "User Creation failed",
    });
  }
};

//login functionality

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const alreadyuser = await User.findOne({ email: email });
    console.log("User found :", alreadyuser);
    if (!alreadyuser) {
      res.render("login", { error: "User not registered !  GO to signup" });
    } else {
      if (!alreadyuser.isVerified) {
        res.render("login", {
          error: "Please Verify Your Acccount on email sent !",
        });
      }

      if (await bcrypt.compare(password, alreadyuser.password)) {
        if (alreadyuser.isVerified === true) {
          req.session.isLoggedIn = true;
          req.session.user = alreadyuser;
          req.session.user.password = "";
          req.session.isAdmin = alreadyuser.isAdmin;
          console.log("User stored inside session", req.session);
          res.redirect("/");
        }
      } else {
        res.render("login", { error: "Password is incorrect" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      message: "User Login failed",
    });
  }
};

//logout functionality
exports.logout = async (req, res) => {
  if (req.session.isLoggedIn) {
    req.session.destroy((err) => {
      if (!err) res.redirect("/login");
    });
  }
};

//login get functionality
exports.Loginget = (req, res) => {
  if (req.session.isLoggedIn && req.session.user.isVerified) {
    res.redirect("/");
  } else {
    res.render("login", { error: null });
  }
};

//signupgetfunctionality
exports.Signupget = (req, res) => {
  if (req.session.isLoggedIn && req.session.user.isVerified) {
    res.redirect("/");
  } else {
    res.status(200).render("signup", { error: null });
  }
};

//get products with limit
exports.getAllProducts = async (req, res) => {
  const { page } = req.params;
  let perPage = 5;
  let skip = page * perPage;
  try {
    const data = await Product.find()
      .skip(skip)
      .limit(perPage)
      .sort({ updateAt: -1 });
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
