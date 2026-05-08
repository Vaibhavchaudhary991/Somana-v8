// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User must have a name"],
    },
    email: {
      type: String,
      required: [true, "User must have an email"],
      unique: true,
      lowercase: true,
    },
    userName: {
      type: String,
      unique: true,
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "guide", "admin"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    dob: {
      type: Date,
      default: null,
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    bio: {
      type: "String",
      default: "",
    },
    status: {
      type: String,
      default: "",
    },
    subscription: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    maritalStatus: {
      type: String,
      default: "",
    },
    nickname: {
      type: String,
      default: "",
    },
    studiedFrom: {
      type: String,
      default: "",
    },
    qualification: {
      type: String,
      default: "",
    },
    mobileNumber: {
      type: String,
      default: "",
    },
    accountType: {
      type: String,
      default: "Personal",
      enum: ["Personal", "Organization"],
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    badge: {
      type: String,
      default: "Newbie",
    },
    totalPosts: {
      type: Number,
      default: 0,
    },
    creatorScore: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.userName && this.email) {
    this.userName = this.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_");
  }
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
