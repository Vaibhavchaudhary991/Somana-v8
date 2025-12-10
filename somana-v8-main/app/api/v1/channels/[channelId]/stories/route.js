import connectMongoDB from "@/app/_lib/mongodb";
import Channel from "@/app/_models/channelModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { channelId } = params;

  // Connect to the database
  await connectMongoDB();

  try {
    // Fetch the channel by ID and populate stories
    const channel = await Channel.findById(channelId).populate({
      path: "stories",
      select: "-content -collectedImages -tags -description",
    });

    // If channel not found
    if (!channel) {
      return NextResponse.json(
        { status: "fail", message: `Channel not found with id ${channelId}` },
        { status: 404 }
      );
    }

    // Respond with the stories
    return NextResponse.json({
      status: "success",
      message: "Stories fetched successfully",
      data: { stories: channel.stories },
    });
  } catch (error) {
    console.error("Error fetching channel stories:", error);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
