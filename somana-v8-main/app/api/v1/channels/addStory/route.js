import connectMongoDB from "@/app/_lib/mongodb";
import Channel from "@/app/_models/channelModel";
import Blog from "@/app/_models/blogModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectMongoDB();

    const { channelId, blogId } = await request.json();

    if (!channelId || !blogId) {
      return NextResponse.json(
        {
          statusText: "error",
          message: "channelId and blogId are required.",
        },
        { status: 400 }
      );
    }

    // Validate the existence of the blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        {
          statusText: "error",
          message: "Blog not found.",
        },
        { status: 404 }
      );
    }

    // Validate the existence of the channel
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return NextResponse.json(
        {
          statusText: "error",
          message: "Channel not found.",
        },
        { status: 404 }
      );
    }

    // Check if the blog is already in the stories array
    if (channel.stories.includes(blogId)) {
      return NextResponse.json(
        {
          statusText: "error",
          message: "Blog is already added to the channel's stories.",
        },
        { status: 400 }
      );
    }

    // Add the blog to the stories array and save the channel
    channel.stories.push(blogId);
    await channel.save();

    return NextResponse.json(
      {
        statusText: "success",
        message: "Blog added to the channel's stories successfully.",
        data: {
          channel,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error adding Blog to Channel:", err);

    return NextResponse.json(
      {
        statusText: "error",
        message: "Server Error.",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
