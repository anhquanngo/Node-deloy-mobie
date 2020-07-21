const mongoose = require("mongoose");

const ejs = require("ejs");
const path = require("path");
const Joi = require("@hapi/joi");
const _ = require("lodash");
const { formatPrice, renderHtml } = require("../../../libs/utils");

const CommentModel = mongoose.model("Comment");
const ProductModel = mongoose.model("Product");

exports.getComemntForProduct = async (req, res) => {
  const { id } = req.body;

  const page = parseInt(req.body.page || 1);
  const limit = 1;

  const skip = (page - 1) * limit;

  const totalDocuments = await CommentModel.find({
    prd_id: id,
  }).countDocuments();

  const totalPages = Math.ceil(totalDocuments / limit);
  const range = [];
  const rangerForDot = [];
  const detal = 1;

  const left = page - detal;
  const right = page + detal;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      range.push(i);
    }
  }

  let temp;
  range.map((i) => {
    if (temp) {
      if (i - temp === 2) {
        rangerForDot.push(i - 1);
      } else if (i - temp !== 1) {
        rangerForDot.push("...");
      }
    }
    temp = i;
    rangerForDot.push(i);
  });

  const comments = await CommentModel.find({ prd_id: id })
    .limit(limit)
    .skip(skip);

  const viewPath = req.app.get("views");

  const html = await ejs.renderFile(
    path.join(viewPath, "site/components/comment-product.ejs"),
    { comments, total: totalDocuments, range: rangerForDot, page, totalPages }
  );

  res.json({
    status: "success",
    data: {
      html: html,
    },
  });
};

exports.updateCart = async (req, res, next) => {
  const bodySchema = Joi.object({
    id: Joi.string().required(),
    qty: Joi.number().required(),
  });

  try {
    const value = await bodySchema.validateAsync(req.body);

    const { id, qty } = value;
    const cart = _.cloneDeep(req.session.cart || []);

    const newCart = cart.map((item) => {
      if (item.id === id) {
        item.qty = qty;
      }

      return item;
    });

    req.session.cart = newCart;
    const ids = newCart.map((prd) => prd.id);
    const products = await ProductModel.find({ _id: { $in: ids } });

    const html = await renderHtml(req, "site/components/list-cart", {
      products,
      miniCart: newCart,
      formatPrice,
    });

    const totalItem = newCart.reduce((a, c) => a + c.qty, 0);

    res.json({
      status: "success",
      data: {
        html: html,
        totalItem,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCart = async (req, res, next) => {
  const bodySchema = Joi.object({
    type: Joi.string().allow("item", "all").default("all"),
    id: Joi.string(),
  });

  try {
    const { type, id } = await bodySchema.validateAsync(req.body);
    let newCart;

    if (type === "all") {
      req.session.cart = newCart = [];
    }
    if (type === "item" && mongoose.Types.ObjectId.isValid(id)) {
      const cart = _.cloneDeep(req.session.cart || []);
      newCart = cart.filter((item) => item.id !== id);
      req.session.cart = newCart;
    }

    const ids = newCart.map((prd) => prd.id);
    const products = ids.length
      ? await ProductModel.find({ _id: { $in: ids } })
      : [];

    const html = await renderHtml(req, "site/components/list-cart", {
      products,
      miniCart: newCart,
      formatPrice,
    });

    const totalItem = newCart.reduce((a, c) => a + c.qty, 0);
    res.json({
      status: "success",
      data: {
        html: html,
        totalItem,
      },
    });
  } catch (error) {
    next(error);
  }
};
