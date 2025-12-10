import connectMongoDB from "@/app/_lib/mongodb";
import Channel from "@/app/_models/channelModel";
import APIFeatures from "@/app/_utils/apiFeatures";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    const features = new APIFeatures(Channel.find(), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const channels = await features.query;

    return NextResponse.json(
      {
        statusText: "success",
        message: "Channels fetched successfully",
        results: channels.length,
        data: {
          channels,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching Channels:", err);

    return NextResponse.json(
      {
        statusText: "error",
        message: "Error getting Channels",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectMongoDB();
    const data = await request.json();
    const newChannel = await Channel.create(data);
    return NextResponse.json(
      {
        statusText: "success",
        message: "Channel created successfully",
        data: {
          newChannel,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating Channel:", err);
    return NextResponse.json(
      {
        statusText: "error",
        message: "Error creating Channel",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
