const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const joi = require("@hapi/joi");

const Product = mongoose.model("Product");
const Category = mongoose.model("Category");

module.exports.index = async function (req, res) {
  const page = parseInt(req.query.page || 1);
  const limit = 10;

  const skip = (page - 1) * limit;

  const totalDocuments = await Product.find().countDocuments();

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

  const products = await Product.find()
    .populate("cat_id")
    .sort("-_id")
    .limit(limit)
    .skip(skip);

  res.render("admin/pages/products/index", {
    products,
    range: rangerForDot,
    page,
    totalPages,
  });
};

module.exports.add = async function (req, res) {
  const categories = await Category.find();

  res.render("admin/pages/products/add", { categories });
};

module.exports.store = async function (req, res) {
  const file = req.file;
  const pathUpload = path.resolve("src", "public", "images", "products");

  const contentFile = fs.readFileSync(file.path);
  fs.unlinkSync(file.path);
  fs.writeFileSync(path.join(pathUpload, file.originalname), contentFile);

  const bodySchema = joi
    .object({
      prd_name: joi.string().required(),
      prd_price: joi.number().required(),
    })
    .unknown();

  const value = await bodySchema.validateAsync(req.body).catch((err) => err);

  if (value instanceof Error) {
    return res.redirect("/admin/products/add");
  }

  const product = new Product({
    prd_name: value.prd_name,
    cat_id: value.cat_id,
    prd_image: file.originalname,
    prd_price: value.prd_price,
    prd_warranty: value.prd_warranty,
    prd_accessories: value.prd_accessories,
    prd_new: value.prd_new,
    prd_promotion: value.prd_promotion,
    prd_status: value.prd_status,
    prd_featured: value.prd_featured,
    prd_details: value.prd_details,
  });

  await product.save();

  return res.redirect("/admin/products");
};

module.exports.edit = async function (req, res) {
  const { id } = req.params;

  const categories = await Category.find();
  const product = await Product.findById(id);

  res.render("admin/pages/products/edit", { categories, product });
};

module.exports.update = async function (req, res) {
  const { id } = req.params;

  const file = req.file;

  if (file) {
    const pathUpload = path.resolve("src", "public", "images", "products");

    const contentFile = fs.readFileSync(file.path);
    fs.unlinkSync(file.path);
    fs.writeFileSync(path.join(pathUpload, file.originalname), contentFile);
  }

  const bodySchema = joi
    .object({
      prd_name: joi.string().required(),
      prd_price: joi.number().required(),
    })
    .unknown();

  const value = await bodySchema.validateAsync(req.body).catch((err) => err);
  if (value instanceof Error) {
    return res.redirect(req.path);
  }

  const productUpdate = {
    prd_name: value.prd_name,
    cat_id: value.cat_id,
    prd_price: value.prd_price,
    prd_warranty: value.prd_warranty,
    prd_accessories: value.prd_accessories,
    prd_new: value.prd_new,
    prd_promotion: value.prd_promotion,
    prd_status: value.prd_status,
    prd_featured: value.prd_featured,
    prd_details: value.prd_details,
  };

  if (file) {
    productUpdate["prd_image"] = file.originalname;
  }

  await Product.updateOne({ _id: id }, productUpdate);

  return res.redirect("/admin/products");
};

module.exports.destroy = async function (req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.redirect("/admin/products");
  }

  const product = await Product.findByIdAndDelete(id);
  if (product) {
    const pathUpload = path.resolve("src", "public", "images", "products");
    if (fs.existsSync(path.join(pathUpload, product.prd_image))) {
      fs.unlinkSync(path.join(pathUpload, product.prd_image));
    }
  }

  return res.redirect("/admin/products");
};
