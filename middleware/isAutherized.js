module.exports = isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return res.status(403).render("403", {
      path: "/403",
      pageTitle: "403 Forbidden",
    });
  }
  next();
};
