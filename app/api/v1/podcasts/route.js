import connectMongoDB from "@/app/_lib/mongodb";
import Podcast from "@/app/_models/podcastModel";
import APIFeatures from "@/app/_utils/apiFeatures";
import { updateUserXP } from "@/app/_utils/updateUserXP";
import { XP_ACTIONS } from "@/app/_utils/xpSystem";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    const features = new APIFeatures(Podcast.find(), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const podcasts = await features.query;

    return NextResponse.json(
      {
        statusText: "success",
        message: "Podcasts fetched successfully",
        results: podcasts.length,
        data: {
          podcasts,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching Podcasts:", err);

    return NextResponse.json(
      {
        statusText: "error",
        message: "Error getting Podcasts",
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
    if (!data.author) {
      return NextResponse.json(
        {
          statusText: "fail",
          message: "Author is required to create a Podcast.",
        },
        { status: 400 }
      );
    }
    const newPodcast = await Podcast.create(data);
    await updateUserXP(data.author, XP_ACTIONS.PODCAST_UPLOAD);
    return NextResponse.json(
      {
        statusText: "success",
        message: "Podcasts created successfully",
        data: {
          newPodcast,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating Podcast:", err);
    return NextResponse.json(
      {
        statusText: "error",
        message: "Error creating Podcast",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
