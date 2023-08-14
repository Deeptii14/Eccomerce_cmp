const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { sendemail } = require("../utlis/mailSend");
const Token = require("../models/Token");

exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const finduser = await User.findOne({ email: email });
    console.log(finduser);
    if (finduser) {
      const tokencreated = crypto.randomBytes(32).toString("hex");
      const tokenadded = await Token.create({
        user: finduser._id,
        token: tokencreated,
      });
      console.log("Token created", tokenadded);
      const link = `http://localhost:8000/passwordresetform/${finduser._id}/${tokencreated}`;
      const result = await sendemail(
        email,
        "Password Reset Link",
        link,
        `<h1>Click this link to change Your Password</h1><p>
        Token is valid only for 30 minutes .
        Please change yout password with in it.
        </p><a href=${link}>Click here</a>`
      );
      console.log("mail result of forgotpassword", result);
    } else {
      res.status(400).json({
        success: false,
        message: "Email Not Found",
      });
    }
    res.redirect("/login");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Password recovery failed due to Internal server error",
      error: error,
    });
  }
};

//reset password and add to databse update
exports.resetPassword = async (req, res) => {
  const { tid } = req.params;
  const { new_password, confirm_password } = req.body;
  try {
    if (new_password !== confirm_password) {
      res.send("Password not matched !");
    }
    const match = await Token.findOne({ token: tid });
    console.log("matched token", match);
    const userdetail = await User.findById({ _id: match.user });
    if (match) {
      const hashedpassword = await bcrypt.hash(new_password, 10);
      const userupdated = await User.findByIdAndUpdate(
        { _id: match.user },
        {
          password: hashedpassword,
        },
        {
          new: true,
        }
      );
      console.log("User updated", userupdated);
      await Token.findByIdAndDelete({ _id: match._id });
    }
    await sendemail(
      userdetail.email,
      "Password Updated Successfully ",
      "Login with new password",
      `<h1>Congratulations ! ${userdetail.name}</h1><p>
    Password Updated Successfully !</p>`
    );
    res.status(200).render("passwdsuccs");
  } catch (error) {
    console.log(error);
    res.send("Password updation failed");
  }
};
