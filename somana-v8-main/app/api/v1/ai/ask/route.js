import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  throw new Error("Please set the GROQ_API_KEY environment variable.");
}

export async function POST(request) {
  try {
    const { question } = await request.json();
    console.log("AI API: Received question:", question);

    if (!question) {
      console.log("AI API: No question provided");
      return NextResponse.json(
        { statusText: "error", message: "Question is required" },
        { status: 400 }
      );
    }

    console.log("AI API: Sending request to Groq...");
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Updated model
          messages: [{ role: "user", content: question }],
        }),
      }
    );

    const data = await response.json();
    console.log("AI API: Groq response status:", response.status);

    if (!response.ok) {
      console.error("AI API: Groq error:", data);
      return NextResponse.json(
        { statusText: "error", message: "Groq API error", error: data },
        { status: response.status }
      );
    }

    const answer = data.choices?.[0]?.message?.content || "No response";
    console.log("AI API: Generated answer length:", answer.length);

    return NextResponse.json(
      {
        statusText: "success",
        question,
        answer,
        by: "Akarsh Rajput",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("AI API: Internal server error:", error);
    return NextResponse.json(
      {
        statusText: "error",
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
