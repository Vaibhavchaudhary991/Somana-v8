import connectMongoDB from "@/app/_lib/mongodb";
import Blog from "@/app/_models/blogModel";
import APIFeatures from "@/app/_utils/apiFeatures";
import { updateUserXP } from "@/app/_utils/updateUserXP";
import { XP_ACTIONS } from "@/app/_utils/xpSystem";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    // Apply filtering, sorting, limiting, and pagination
    const features = new APIFeatures(Blog.find().select("-content"), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Fetch blogs using the modified query
    const blogs = await features.query;

    return NextResponse.json(
      {
        statusText: "success",
        message: "Blogs fetched successfully",
        results: blogs.length,
        data: {
          blogs,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching blogs:", err);

    return NextResponse.json(
      {
        statusText: "error",
        message: "Error getting blogs",
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

    // Ensure author is provided
    if (!data.author) {
      return NextResponse.json(
        {
          statusText: "fail",
          message: "Author is required to create a blog.",
        },
        { status: 400 }
      );
    }

    // Create the blog
    const newBlog = await Blog.create(data);

    // Award XP to the author
    await updateUserXP(data.author, XP_ACTIONS.BLOG_POST);

    return NextResponse.json(
      {
        statusText: "success",
        message: "Blog created successfully",
        data: {
          newBlog,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating blog:", err);
    return NextResponse.json(
      {
        statusText: "error",
        message: "Error creating Blog",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
