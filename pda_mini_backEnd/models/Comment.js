const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  PopupStore: {
    type: Number,
    required: true,
  },
});

CommentSchema.set("timestamps", { createdAt: true, updatedAt: false });

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
