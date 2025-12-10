import connectMongoDB from "@/app/_lib/mongodb";
import Blog from "@/app/_models/blogModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();
    const url = new URL(request.url);
    const slug = url.pathname.split("blogs/slug/")[1];
    const userId = url.searchParams.get("userId");
    const action = url.searchParams.get("action");

    const blog = await Blog.findOne({ slug: slug });
    if (blog) {
      if (userId) {
        if (!blog.views.includes(userId)) {
          blog.views.push(userId);
          blog.viewsCount += 1;
          await blog.save();
        }
      }

      if (action === "like" && userId) {
        if (blog.likes.includes(userId)) {
          blog.likes.pull(userId);
          blog.likesCount -= 1;
        } else {
          blog.likes.push(userId);
          blog.likesCount += 1;
        }
        await blog.save();
      }

      const blogData = await Blog.findOne({ slug: slug }).lean();
      delete blogData.views;
      delete blogData.likes;
      return NextResponse.json(
        {
          status: "success",
          message: "Blog found successfully",
          data: blogData,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: `Blog not found with slug ${slug}`,
        },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
