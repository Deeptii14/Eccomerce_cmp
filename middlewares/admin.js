exports.isAdmin = (req, res, next) => {
  if (req.session.isAdmin === false) {
    res.send("This route is protected for admins only ");
  } else {
    next();
  }
};
