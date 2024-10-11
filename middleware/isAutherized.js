const User = require("../models/user");

module.exports = (req, res, next) => {
  console.log(req.userRole);

  if (req.userRole !== "admin") {
    res.redirect("/403");
  }
  req.isAdmin = true;
  next();
};
