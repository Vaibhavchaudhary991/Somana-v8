import connectMongoDB from "@/app/_lib/mongodb";
import Blog from "@/app/_models/blogModel";
import { Description } from "@radix-ui/react-alert-dialog";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendingBlogs = await Blog.aggregate([
      {
        $match: {
          views: { $exists: true, $not: { $size: 0 } },
          updatedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $addFields: {
          numberOfViews: { $size: "$views" },
          numberOfLikes: { $size: "$likes" },
        },
      },
      {
        $addFields: {
          engagementScore: {
            $add: [
              { $multiply: ["$numberOfViews", 1] },
              { $multiply: ["$numberOfLikes", 2] },
            ],
          },
        },
      },
      {
        $sort: { engagementScore: -1, updatedAt: -1 },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          heading: 1,
          description: 1,
          featuredImage: 1,
          slug: 1,
          summary: 1,
          createdAt: 1,
          updatedAt: 1,
          "author._id": 1,
          "author.name": 1,
          "author.photo": 1,
          "author.role": 1,
          "author.username": 1,
        },
      },
    ]);

    return NextResponse.json(
      {
        statusText: "success",
        message: "Top trending blogs fetched successfully",
        results: trendingBlogs.length,
        data: {
          blogs: trendingBlogs,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        statusText: "error",
        message: "Error getting trending blogs",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
