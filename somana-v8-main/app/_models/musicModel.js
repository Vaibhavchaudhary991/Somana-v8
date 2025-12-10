import mongoose from "mongoose";
import User from "./userModel"; // Ensure the User model is imported

const musicSchema = new mongoose.Schema(
  {
    musicName: {
      type: String,
      trim: true,
      maxLength: [100, "Song name have less than 100 characters"],
    },
    musicType: {
      type: String,
      trim: true,
    },
    featuredImage: {
      type: String,
    },
    audioLink: {
      type: String,
    },
    releaseDate: {
      type: Date,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Music must have an author"],
    },
    album: {
      type: String,
    },
    credits: {
      type: String,
      trim: true,
    },
    songLang: {
      type: String,
      trim: true,
    },
    lyrics: {
      type: String,
      default: "Not defined by artist",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

musicSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name email photo verified",
  });
  next();
});

const Music = mongoose.models.Music || mongoose.model("Music", musicSchema);

export default Music;
