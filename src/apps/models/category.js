const mongoose = require("mongoose");

const CategoryModel = new mongoose.Schema(
  {
    cat_name: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

CategoryModel.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "cat_id",
});

CategoryModel.set("toObject", {
  virtuals: true,
});
mongoose.model("Category", CategoryModel, "categories");
