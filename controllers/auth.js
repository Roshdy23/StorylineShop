exports.getLogin = (req, res, next) => {
  console.log("aaa");
  return res.render("auth/login", {
    pageTitle: "login",
    path: "/login",
  });
};
