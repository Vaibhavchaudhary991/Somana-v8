import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/app/_lib/auth";
import connectDB from "@/app/_lib/mongodb";
import User from "@/app/_models/userModel";
import Blog from "@/app/_models/blogModel";
import Music from "@/app/_models/musicModel";
import Podcast from "@/app/_models/podcastModel";
import Channel from "@/app/_models/channelModel";

// Helper function to format numbers (e.g., 12500 → 12.5K)
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export async function GET(request) {
  try {
    // Get authenticated session
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.userId;

    await connectDB();

    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 1. Total Stories (count of blogs + music + podcasts)
    const [blogCount, musicCount, podcastCount] = await Promise.all([
      Blog.countDocuments({ author: userId }),
      Music.countDocuments({ author: userId }),
      Podcast.countDocuments({ author: userId }),
    ]);
    const totalStories = blogCount + musicCount + podcastCount;

    // 2. Total Plays (Total views across all content)
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

    // 3. Followers (subscribers to user's channels)
    const userChannels = await Channel.find({ author: userId });
    const followers = userChannels.reduce(
      (total, channel) => total + (channel.subscribers?.length || 0),
      0
    );

    // 4. Creator Level (based on user level and badge)
    const creatorLevel = `${user.badge} (Lvl ${user.level})`;

    // Return stats with both raw and formatted values
    return NextResponse.json({
      success: true,
      data: {
        totalStories: {
          raw: totalStories,
          formatted: formatNumber(totalStories),
        },
        totalPlays: {
          raw: totalPlays,
          formatted: formatNumber(totalPlays),
        },
        followers: {
          raw: followers,
          formatted: formatNumber(followers),
        },
        creatorLevel: creatorLevel,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
