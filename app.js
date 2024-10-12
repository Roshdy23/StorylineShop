const path = require("path");

const express = require("express");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(cookieParser());

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);

app.use(shopRoutes);
app.use(authRoutes);
app.get("/403", errorController.get403);
app.use(errorController.get404);

mongoose
  .connect(
    "your Mongodb atlas connection string"
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
