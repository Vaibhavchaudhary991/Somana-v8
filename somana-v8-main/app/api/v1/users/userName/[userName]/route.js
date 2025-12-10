import { NextResponse } from "next/server";
import connectMongoDB from "@/app/_lib/mongodb";
import User from "@/app/_models/userModel";

export async function GET(request) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Extract userName from the URL
    const url = new URL(request.url);
    const userName = url.pathname.split("users/userName/")[1];

    // Ensure userName is valid
    if (!userName) {
      return NextResponse.json(
        { status: "error", message: "Invalid userName in the request" },
        { status: 400 }
      );
    }

    // Find the user by userName
    const user = await User.findOne({ userName });

    // Check if user exists
    if (user) {
      return NextResponse.json(
        {
          status: "success",
          message: "User found successfully",
          data: user,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: `User not found with userName ${userName}`,
        },
        { status: 404 }
      );
    }
  } catch (err) {
    console.error("Error fetching blog:", err);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
