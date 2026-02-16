import { NextResponse } from "next/server";
import { auth } from "@/app/_lib/auth";
import connectDB from "@/app/_lib/mongodb";
import mongoose from "mongoose";
import User from "@/app/_models/userModel";
import Blog from "@/app/_models/blogModel";
import Music from "@/app/_models/musicModel";
import Podcast from "@/app/_models/podcastModel";
import Channel from "@/app/_models/channelModel";

export async function GET(request, { params }) {
  try {
    // Get authenticated session
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userID } = params;
    const userId = userID; // Alias for internal use to keep consistency

    // Verify user is requesting their own stats
    if (session.user.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    await connectDB();

    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 1. Count tracks uploaded by user
    const tracksCount = await Music.countDocuments({ author: userId });

    // 2. Count followers (subscribers to user's channels)
    const userChannels = await Channel.find({ author: userId });
    const followersCount = userChannels.reduce(
      (total, channel) => total + (channel.subscribers?.length || 0),
      0
    );

    // 3. Calculate total plays across all content types
    const [blogViews, musicViews, podcastViews] = await Promise.all([
      Blog.aggregate([
        { $match: { author: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$viewsCount" } } }
      ]),
      Music.aggregate([
        { $match: { author: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$viewsCount" } } }
      ]),
      Podcast.aggregate([
        { $match: { author: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: "$viewsCount" } } }
      ])
    ]);

    const totalPlays = (blogViews[0]?.total || 0) + 
                       (musicViews[0]?.total || 0) + 
                       (podcastViews[0]?.total || 0);

    // 4. Calculate profile completion percentage
    const profileFields = [
      user.name,
      user.email,
      user.photo,
      user.bio,
      user.mobileNumber,
      user.city,
      user.state,
      user.country,
      user.occupation,
      user.dob,
      user.gender,
      user.qualification,
    ];

    const filledFields = profileFields.filter(
      (field) => field && field.toString().trim() !== ""
    ).length;
    const profileCompletion = Math.round(
      (filledFields / profileFields.length) * 100
    );

    // Return stats
    return NextResponse.json({
      success: true,
      data: {
        tracksCount,
        followersCount,
        totalPlays,
        profileCompletion,
        xp: user.xp || 0,
        level: user.level || 1,
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
