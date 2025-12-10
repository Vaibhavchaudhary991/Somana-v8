import connectMongoDB from "@/app/_lib/mongodb";
import Channel from "@/app/_models/channelModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();
    const id = request.url.split("/channels/")[1];

    const channel = await Channel.findById(id);
    if (channel) {
      return NextResponse.json(
        {
          status: "success",
          message: "Channel found successfully",
          data: channel,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: `Channel not found with id ${id}`,
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
