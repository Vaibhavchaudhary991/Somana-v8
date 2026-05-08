import mongoose from "mongoose";
import Blog from "./blogModel";
import User from "./userModel";

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: [true, "Channel must have a name"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Channel must have an author"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [300, "Bio cannot exceed 300 characters"],
    },
    labelImage: {
      type: String,
    },
    stories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Blog",
      },
    ],
    subscribers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

channelSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name email photo verified accountType",
  });
  next();
});

channelSchema.virtual("contentCount").get(function () {
  return this.stories ? this.stories.length : 0;
});

const Channel =
  mongoose.models.Channel || mongoose.model("Channel", channelSchema);

export default Channel;
