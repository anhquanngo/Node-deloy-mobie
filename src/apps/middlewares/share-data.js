const mongoose = require("mongoose");
const CategoryModel = mongoose.model("Category");
const { formatPrice } = require("../../libs/utils");

module.exports = async function (req, res, next) {
  res.locals.menus = await CategoryModel.find();
  res.locals.miniCart = req.session.cart || [];
  res.locals.formatPrice = formatPrice;
  next();
};
