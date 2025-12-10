import mongoose from "mongoose";
import Blog from "./blogModel";
import User from "./userModel";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment cannot be empty"],
      maxlength: [1000, "Comment must have less than 1000 characters."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    blogId: {
      type: mongoose.Schema.ObjectId,
      ref: "Blog",
      required: [true, "Comment must belong to a blog"],
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Comment must have an author"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name email photo verified accountType",
  });
  next();
});

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
