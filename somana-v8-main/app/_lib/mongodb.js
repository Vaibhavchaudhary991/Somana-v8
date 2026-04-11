// utils/connectMongoDB.js
import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectMongoDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!process.env.DATABASE) {
      throw new Error("Please define the DATABASE environment variable inside .env.local");
    }

    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    // Log the connection attempt (masking password)
    const connectString = process.env.DATABASE;
    const maskedString = connectString.replace(/:([^:@]+)@/, ":****@");
    console.log(`Attempting to connect to MongoDB: ${maskedString}`);

    cached.promise = mongoose.connect(process.env.DATABASE, opts).then((mongoose) => {
      console.log("Database Connected Successfully!");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Database Connection Error:", e);
    throw e;
  }

  return cached.conn;
};

export default connectMongoDB;
