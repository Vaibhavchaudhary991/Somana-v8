import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const anonSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    timeLimit: {
      type: String,
      default: 24,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    ip: {
      type: String,
    },
    region: {
      type: String,
    },
    country: {
      type: String,
    },
    location: {
      type: String,
    },
    anonId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    isActive: {
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

const Anon = mongoose.models.Anon || mongoose.model("Anon", anonSchema);

export default Anon;
