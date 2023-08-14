const User = require("../models/User");

//verification of mail
exports.verifyEmail = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      console.log("USER not found for verfication");
    }
    const updateduser = await User.findByIdAndUpdate(
      { _id: id },
      { isVerified: true },
      { new: true }
    );
    if (updateduser) {
      res.render("verifysuccess");
    } else {
      res.render("error");
    }
  } catch (error) {
    console.log(error);
    res.render("wrong");
  }
};
