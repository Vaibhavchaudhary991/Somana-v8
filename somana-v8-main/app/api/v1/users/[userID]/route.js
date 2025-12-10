import connectMongoDB from "@/app/_lib/mongodb";
import User from "@/app/_models/userModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const userId = request.url.split("users/")[1];
    await connectMongoDB();
    const user = await User.findById(userId);
    if (user) {
      return NextResponse.json(
        {
          status: "success",
          message: "User found Successfully",
          data: user,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: `User not found with id ${userId}`,
        },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { statusText: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const userId = request.url.split("users/")[1];
    await connectMongoDB();
    const updateData = await request.json();
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    return NextResponse.json(
      {
        status: "success",
        message: "Minder updated Successfully",
        data: {
          updatedUser: updatedUser,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { statusText: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
