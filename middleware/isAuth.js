const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "super secret key", (err, decodedToken) => {
      if (err) {
        return res.redirect("/login");
      }

      req.userId = decodedToken.userId;
      req.userRole = decodedToken.userRole;

      next();
    });
  } else {
    return res.redirect("/login");
  }
};
