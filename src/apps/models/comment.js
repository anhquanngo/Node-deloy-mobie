const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    prd_id: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    content: String,
    info: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model("Comment", CommentSchema, "comments");
