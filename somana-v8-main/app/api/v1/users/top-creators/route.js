import { NextResponse } from "next/server";
import connectMongoDB from "@/app/_lib/mongodb";
import User from "@/app/_models/userModel";

export async function GET() {
  try {
    await connectMongoDB();

    // Find top 5 users sorted by XP and level
    const topUsers = await User.find({})
      .sort({ xp: -1, level: -1 }) // Highest XP, then level
      .limit(5)
      .select("name userName photo badge level xp creatorScore totalPosts") // Only required fields
      .lean();

    return NextResponse.json({
      status: "success",
      data: topUsers,
    });
  } catch (error) {
    console.error("Error fetching top creators:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch top creators." },
      { status: 500 }
    );
  }
}
