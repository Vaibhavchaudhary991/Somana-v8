import connectMongoDB from "@/app/_lib/mongodb";
import Feedback from "@/app/_models/feedbackModel";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectMongoDB();
    const data = await request.json();
    const newFeedback = await Feedback.create(data);
    return NextResponse.json(
      {
        statusText: "success",
        message: "Feedback created successfully",
        data: {
          newFeedback,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating Feedback:", err);
    return NextResponse.json(
      {
        statusText: "error",
        message: "Error creating Feedback",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
