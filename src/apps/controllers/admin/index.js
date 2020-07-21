const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { func } = require("@hapi/joi");

const Category = mongoose.model("Category");
const Product = mongoose.model("Product");
const User = mongoose.model("User");

module.exports.dashboard = async function (req, res) {
  res.render("admin/pages/dashboard", { data: {} });
};

module.exports.login = function (req, res) {
  res.render("admin/pages/login", { error: "" });
};

module.exports.postLogin = async function (req, res) {
  const email = req.body.mail;
  const pass = req.body.pass;

  const user = await User.findOne({ user_mail: email });
  let error;

  if (!user) {
    error = " Tài khoản không tồn tại";
  }

  if (!error && user.user_pass !== pass) {
    error = "Mật khẩu không khớp";
  }

  if (!error) {
    req.session.user = user;
    return res.redirect("/admin/dashboard");
  }

  res.render("admin/pages/login", {
    error,
  });
};

module.exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect("/login");
};
