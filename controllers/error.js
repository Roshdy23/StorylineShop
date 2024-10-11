exports.get404 = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      pageTitle: "Page Not Found",
      path: "/404",
      isAdmin: false,
      isLoggedIn: false,
    });
};

exports.get403 = (req, res, next) => {
  res
    .status(403)
    .render("403", {
      pageTitle: "Access Denied",
      path: "/403",
      isAdmin: false,
      isLoggedIn: true
    });
};
