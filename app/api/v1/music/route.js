import connectMongoDB from "@/app/_lib/mongodb";
import Music from "@/app/_models/musicModel";
import APIFeatures from "@/app/_utils/apiFeatures";
import { updateUserXP } from "@/app/_utils/updateUserXP";
import { XP_ACTIONS } from "@/app/_utils/xpSystem";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    const features = new APIFeatures(Music.find(), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tracks = await features.query;

    return NextResponse.json(
      {
        statusText: "success",
        message: "Music fetched successfully",
        results: tracks.length,
        data: {
          tracks,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching tracks:", err);

    return NextResponse.json(
      {
        statusText: "error",
        message: "Error getting tracks",
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
          message: "Author is required to create a Music.",
        },
        { status: 400 }
      );
    }
    const newMusic = await Music.create(data);
    await updateUserXP(data.author, XP_ACTIONS.MUSIC_UPLOAD);
    return NextResponse.json(
      {
        statusText: "success",
        message: "Music created successfully",
        data: {
          newMusic,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating Music:", err);
    return NextResponse.json(
      {
        statusText: "error",
        message: "Error creating Music",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
