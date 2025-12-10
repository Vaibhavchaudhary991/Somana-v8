import connectMongoDB from "@/app/_lib/mongodb";
import Podcast from "@/app/_models/podcastModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const minderId = request.url.split("podcasts/")[1];
    await connectMongoDB();
    const minder = await Podcast.findById(minderId);
    if (minder) {
      return NextResponse.json(
        {
          status: "success",
          message: "Podcast found Successfully",
          data: minder,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: `Podcast not found with id ${minderId}`,
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
