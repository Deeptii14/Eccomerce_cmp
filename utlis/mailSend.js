const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  host: process.env.HOST,

  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

exports.sendemail = async (email, subject, text, html) => {
  try {
    let info = await transporter.sendMail({
      from: '"Deepti 👻" <isha40470@gmail.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: text,
      html:html, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log("Error while sending Mail", error);
  }
};
