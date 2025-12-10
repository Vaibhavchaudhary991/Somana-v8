import connectMongoDB from "@/app/_lib/mongodb";
import Comment from "@/app/_models/commentModel";
import APIFeatures from "@/app/_utils/apiFeatures";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    const features = new APIFeatures(Comment.find(), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const comments = await features.query;

    return NextResponse.json(
      {
        statusText: "success",
        message: "Comments fetched successfully",
        results: comments.length,
        data: {
          comments,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching Comments:", err);

    return NextResponse.json(
      {
        statusText: "error",
        message: "Error getting Comments",
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
    const newComment = await Comment.create(data);
    return NextResponse.json(
      {
        statusText: "success",
        message: "Comment created successfully",
        data: {
          newComment,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating Comment:", err);
    return NextResponse.json(
      {
        statusText: "error",
        message: "Error creating Comment",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
