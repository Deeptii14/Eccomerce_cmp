const express = require("express");
const multer = require("multer");
const session = require("express-session");
const { DBconnect } = require("./config/database");
const app = express();
const authRoutes = require("./routes/Auth");
const { verifyEmail } = require("./controller/Email");
const { isAdmin } = require("./middlewares/admin");
const upload = multer({ dest: "uploads/" });
const adminroutes = require("./routes/Admin");
const { createProduct } = require("./controller/Admin");
const { resetPassword, ForgotPassword } = require("./controller/Password");
//for photo upload
app.use(express.static("uploads"));

app.use(upload.single("photo"));
//consoles type of req
app.use(function (req, res, next) {
  console.log(req.method, req.url);
  next();
});

//set ejs
app.set("view engine", "ejs");

//form data parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//database connection
DBconnect();

//sesion
app.use(
  session({
    secret: "iam asecret on SSR",
    resave: true,
    saveUninitialized: true,
  })
);

//home url and admin get urls
app.use("/", authRoutes);
app.get("/admin", isAdmin, (req, res) => {
  res.render("AdminDashboard", { user: req.session.user });
});

app.use("/admin", isAdmin, adminroutes);
app.get("/", function (req, res) {
  if (req.session.isLoggedIn === true) {
    if (req.session.isAdmin === true) {
      res.redirect("/admin");
    } else if (req.session.isAdmin === false) {
      res.render("dashboard", { user: req.session.user, isAdmin: null });
    }
  } else {
    res.render("homepage", { error: null });
  }
});

app.get("/verifyemail/:id", verifyEmail);

//forget password
app.get("/forgotpassword", (req, res) => {
  res.render("forgotPasswdE");
});

app.post("/forgotpassword", ForgotPassword);
app.get("/passwordresetform/:uid/:token", (req, res) => {
  const { uid, token } = req.params;
  res.render("passwordreset", {
    user:uid,
    token: token,
  });
});
app.post("/reset/:tid", resetPassword);

//about page
app.get("/about", (req, res) => {
  res.render("About", { user: req.session.user });
});

//style css
app.get("/styles.css", function (req, res) {
  res.sendFile(__dirname + "/styles.css");
});

//intilaise server
app.listen(8000, () => {
  console.log("Server is running at port 8000");
});
