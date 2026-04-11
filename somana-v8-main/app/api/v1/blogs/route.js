import connectMongoDB from "@/app/_lib/mongodb";
import Blog from "@/app/_models/blogModel";
import APIFeatures from "@/app/_utils/apiFeatures";
import { updateUserXP } from "@/app/_utils/updateUserXP";
import { XP_ACTIONS } from "@/app/_utils/xpSystem";
import { NextResponse } from "next/server";
import supabase from "@/app/_lib/supabase";

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

    let data;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      data = {};
      
      // Extract fields from formData
      for (const [key, value] of formData.entries()) {
        if (key === "pdfFile") continue; // Handle file separately
        
        // Handle special fields
        if (key === "collectedImages") {
          try {
            data[key] = JSON.parse(value);
          } catch (e) {
            data[key] = [value];
          }
        } else {
          data[key] = value;
        }
      }

      // Handle PDF File upload
      const pdfFile = formData.get("pdfFile");
      if (pdfFile && pdfFile instanceof File && pdfFile.size > 0) {
        // 1. Backend Validation
        if (pdfFile.type !== "application/pdf") {
          return NextResponse.json(
            { statusText: "fail", message: "Only PDF files are allowed." },
            { status: 400 }
          );
        }
        if (pdfFile.size > 20 * 1024 * 1024) { // 20MB
          return NextResponse.json(
            { statusText: "fail", message: "PDF size must be under 20MB." },
            { status: 400 }
          );
        }

        // 2. Upload to Supabase
        const fileName = `pdfs/${Date.now()}-${pdfFile.name.replace(/\s+/g, "_")}`;
        const { error: uploadError } = await supabase.storage
          .from("story-images")
          .upload(fileName, pdfFile);

        if (uploadError) {
          console.error("PDF upload error:", uploadError);
          return NextResponse.json(
            { statusText: "error", message: "Failed to upload PDF to storage." },
            { status: 500 }
          );
        }

        // 3. Set PDF URL
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        data.pdfFile = `${supabaseUrl}/storage/v1/object/public/story-images/${fileName}`;
      }
    } else {
      try {
        data = await request.json();
      } catch (e) {
        console.error("Error parsing request JSON:", e);
        return NextResponse.json(
          { statusText: "error", message: "Invalid JSON in request body" },
          { status: 400 }
        );
      }
    }

    console.log("Blog POST: Processed data:", {
      heading: data.heading,
      description: data.description,
      author: data.author,
      genre: data.genre,
      tags: data.tags,
      hasPdf: !!data.pdfFile,
    });

    // Ensure author is provided
    if (!data.author) {
      console.log("Validation Failed: Author is missing");
      return NextResponse.json(
        {
          statusText: "fail",
          message: "Author is required to create a blog.",
        },
        { status: 400 }
      );
    }

    // Map 'images' field to 'collectedImages' if present
    if (data.images && !data.collectedImages) {
      data.collectedImages = data.images;
      delete data.images;  
    }

    // Trim and validate required fields before creating
    if (!data.heading || typeof data.heading !== "string") {
      console.log("Validation Failed: Heading missing or not a string", { heading: data.heading, type: typeof data.heading });
      return NextResponse.json(
        {
          statusText: "fail",
          message: "Heading is required and must be a string.",
        },
        { status: 400 }
      );
    }

    data.heading = data.heading.trim();
    if (data.heading.length < 10) {
      console.log("Validation Failed: Heading too short", { length: data.heading.length });
      return NextResponse.json(
        {
          statusText: "fail",
          message: `Heading must be at least 10 characters long. Current length: ${data.heading.length}`,
        },
        { status: 400 }
      );
    }

    if (data.heading.length > 100) {
      console.log("Validation Failed: Heading too long", { length: data.heading.length });
      return NextResponse.json(
        {
          statusText: "fail",
          message: `Heading must be less than 100 characters. Current length: ${data.heading.length}`,
        },
        { status: 400 }
      );
    }

    if (!data.description || typeof data.description !== "string") {
      console.log("Validation Failed: Description missing or not a string", { description: data.description, type: typeof data.description });
      return NextResponse.json(
        {
          statusText: "fail",
          message: "Description is required and must be a string.",
        },
        { status: 400 }
      );
    }

    data.description = data.description.trim();
    if (data.description.length < 20) {
      console.log("Validation Failed: Description too short", { length: data.description.length });
      return NextResponse.json(
        {
          statusText: "fail",
          message: `Description must be at least 20 characters long. Current length: ${data.description.length}`,
        },
        { status: 400 }
      );
    }

    if (data.description.length > 300) {
      return NextResponse.json(
        {
          statusText: "fail",
          message: `Description must be less than 300 characters. Current length: ${data.description.length}`,
        },
        { status: 400 }
      );
    }

    // Set default genre if not provided
    if (!data.genre || typeof data.genre !== "string") {
      data.genre = "Blog";
    }

    data.genre = data.genre.trim();
    if (data.genre.length < 3) {
      return NextResponse.json(
        {
          statusText: "fail",
          message: `Genre must be at least 3 characters long. Current value: "${data.genre}"`,
        },
        { status: 400 }
      );
    }

    if (data.genre.length > 50) {
      return NextResponse.json(
        {
          statusText: "fail",
          message: `Genre must be less than 50 characters. Current length: ${data.genre.length}`,
        },
        { status: 400 }
      );
    }

    // Create the blog
    const newBlog = await Blog.create(data);

    // Award XP to the author (Non-blocking)
    try {
      await updateUserXP(data.author, XP_ACTIONS.BLOG_POST);
    } catch (xpErr) {
      console.error("Error awarding XP to user:", xpErr);
      // We don't want XP failures to prevent blog publishing
    }

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
    if (typeof data !== 'undefined') {
      console.log("Request data that caused error:", data);
    }
    console.error("Error stack:", err.stack);
    
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors).map((e) => e.message);
      return NextResponse.json(
        {
          statusText: "error",
          message: "Validation error",
          error: validationErrors.join(", "),
          details: err.errors,
        },
        { status: 400 }
      );
    }

    // Handle duplicate key errors (e.g., slug)
    if (err.code === 11000) {
      return NextResponse.json(
        {
          statusText: "error",
          message: "A blog with this title already exists. Please use a different title.",
          error: err.message,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        statusText: "error",
        message: "Error creating Blog",
        error: err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      },
      { status: 500 }
    );
  }
}
