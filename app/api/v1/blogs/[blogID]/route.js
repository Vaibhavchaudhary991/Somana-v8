import connectMongoDB from "@/app/_lib/mongodb";
import supabase from "@/app/_lib/supabase";
import Blog from "@/app/_models/blogModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const minderId = request.url.split("blogs/")[1];
    await connectMongoDB();
    const minder = await Blog.findById(minderId);
    if (minder) {
      return NextResponse.json(
        {
          status: "success",
          message: "Blog found Successfully",
          data: minder,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: `Blog not found with id ${minderId}`,
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

export async function DELETE(request) {
  try {
    const minderId = request.url.split("blogs/")[1];
    await connectMongoDB();

    // Find the blog to get the image URL
    const blog = await Blog.findById(minderId);
    if (!blog) {
      return NextResponse.json(
        {
          status: "error",
          message: `Blog not found with id ${minderId}`,
        },
        { status: 404 }
      );
    }

    const image = blog.featuredImage;

    const imageName = image.split("/").pop();

    // Delete the image from Supabase storage
    if (imageName != "default-story.png") {
      const { error } = await supabase.storage
        .from("blog-featured-images")
        .remove([imageName]);
      if (error) {
        return NextResponse.json(
          {
            status: "error",
            message: "Error deleting image from Supabase",
            error: error.message,
          },
          { status: 500 }
        );
      }
    }
    // Delete the blog from MongoDB
    await Blog.findByIdAndDelete(minderId);

    return NextResponse.json(
      {
        status: "success",
        message: "Blog and associated image deleted successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { statusText: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const minderId = request.url.split("blogs/")[1];
    await connectMongoDB();
    const updateData = await request.json();
    const updatedBlog = await Blog.findByIdAndUpdate(minderId, updateData, {
      new: true,
    });
    return NextResponse.json(
      {
        status: "success",
        message: "Minder updated Successfully",
        data: {
          updatedBlog: updatedBlog,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { statusText: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
