import mongoose from "mongoose";
import User from "./userModel"; // Ensure the User model is imported

const podcastSchema = new mongoose.Schema(
  {
    podcastName: {
      type: String,
      required: [true, "Podcast must have a name"],
      trim: true,
      maxLength: [150, "Podcast name must have less than 150 characters"],
    },
    podcastType: {
      type: String,
      default: "other",
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [1000, "Description must be less than 1000 characters"],
    },
    featuredImage: {
      type: String,
    },
    audioLink: {
      type: String,
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number,
      default: 1,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Podcast must have an author"],
    },
    album: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
      default: "other",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    credits: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      trim: true,
      required: [true, "Podcast must specify a language"],
    },
    transcript: {
      type: String,
      default: "Transcript not available",
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // Round to 1 decimal place
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    isExplicit: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Populate author and co-authors details
podcastSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name email photo verified",
  });
  next();
});

podcastSchema.virtual("totalEngagement").get(function () {
  return this.viewsCount + this.downloadCount;
});

podcastSchema.virtual("authorID").get(function () {
  return this.author._id;
});

const Podcast =
  mongoose.models.Podcast || mongoose.model("Podcast", podcastSchema);

export default Podcast;
