import connectMongoDB from "@/app/_lib/mongodb";
import Music from "@/app/_models/musicModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();
    const id = request.url.split("/music/")[1];

    const music = await Music.findById(id);
    if (music) {
      return NextResponse.json(
        {
          status: "success",
          message: "Music found successfully",
          data: music,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: `Music not found with id ${id}`,
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
