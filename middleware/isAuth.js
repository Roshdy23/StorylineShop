const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "super secret key", (err, decodedToken) => {
      if (err) {
        return res.redirect("/login");
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    
    return res.redirect("/login");
  }

  next();
};
