import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  throw new Error("Please set the GROQ_API_KEY environment variable.");
}

export async function POST(request) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { statusText: "error", message: "Question is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-70b-8192", // You can change this to another model Groq supports
          messages: [{ role: "user", content: question }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { statusText: "error", message: "Groq API error", error: data },
        { status: response.status }
      );
    }

    const answer = data.choices?.[0]?.message?.content || "No response";

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
    console.error("Groq API error:", error);
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
