import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  throw new Error("Please set the GROQ_API_KEY environment variable.");
}

const CATEGORIES = [
  "Technology",
  "Career",
  "Business",
  "Culture",
  "Cryptocurrency",
  "Books",
  "Automotive",
  "Beauty",
  "Crafts",
  "Story",
];

export async function POST(request) {
  try {
    const { topic } = await request.json();
    console.log("Professional Content Writer: Received topic:", topic);

    if (!topic) {
      console.log("Professional Content Writer: No topic provided");
      return NextResponse.json(
        { statusText: "error", message: "Topic is required" },
        { status: 400 }
      );
    }

    // Create a comprehensive prompt for professional content generation
    const prompt = `You are a professional content writer. Generate a complete article based on the following topic: "${topic}"

Requirements:
1. Generate a compelling SEO-friendly Title (50-70 characters, engaging and keyword-rich)
2. Write a short Description (2-3 sentences, exactly 150-200 characters, compelling and informative)
3. Write a well-structured Article (800-1200 words) with:
   - Proper HTML headings (use <h2> for H2, <h3> for H3)
   - Engaging, human-like writing
   - No mention of AI or artificial intelligence
   - Avoid generic filler content
   - Use subheadings to break up content
   - Include practical insights and examples
   - Use proper HTML formatting: <p> for paragraphs, <strong> for bold, <em> for italic, <ul><li> for lists
4. Automatically detect the most relevant Category from this list: ${CATEGORIES.join(", ")}
5. Generate exactly 5 relevant SEO Tags (comma-separated, relevant keywords)

Return ONLY valid JSON in this exact format (no markdown code blocks, no explanations, just pure JSON):
{
  "title": "Your SEO-friendly title here",
  "description": "Your 150-200 character description here",
  "category": "Detected category from the list",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "content": "Your full article content in HTML format with <h2> and <h3> headings, <p> paragraphs, and proper HTML structure"
}

Important:
- The description must be exactly 150-200 characters
- The article must be 800-1200 words
- Use HTML formatting: <h2> for main headings, <h3> for subheadings, <p> for paragraphs
- Make the content engaging, informative, and human-written
- Do not mention AI, artificial intelligence, or machine learning
- Ensure the category matches one from the provided list exactly
- Return only valid JSON, no additional text`;

    console.log("Professional Content Writer: Sending request to Groq...");
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are a professional content writer specializing in SEO-optimized articles. Always return valid JSON only, no markdown code blocks or explanations.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      }
    );

    const data = await response.json();
    console.log("Professional Content Writer: Groq response status:", response.status);

    if (!response.ok) {
      console.error("Professional Content Writer: Groq error:", data);
      return NextResponse.json(
        { statusText: "error", message: "Groq API error", error: data },
        { status: response.status }
      );
    }

    const rawContent = data.choices?.[0]?.message?.content || "No response";
    console.log("Professional Content Writer: Generated content length:", rawContent.length);

    // Parse the JSON response
    let articleData;
    try {
      // Remove markdown code blocks if present
      const cleanedContent = rawContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      articleData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Professional Content Writer: JSON parse error:", parseError);
      // Try to extract JSON from the response
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        articleData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse JSON response from AI");
      }
    }

    // Validate required fields
    if (!articleData.title || !articleData.description || !articleData.content) {
      throw new Error("Missing required fields in AI response");
    }

    // Validate category
    if (!CATEGORIES.includes(articleData.category)) {
      console.warn(
        `Invalid category "${articleData.category}", defaulting to first category`
      );
      articleData.category = CATEGORIES[0];
    }

    // Validate tags
    if (!Array.isArray(articleData.tags) || articleData.tags.length !== 5) {
      console.warn("Invalid tags format, ensuring 5 tags");
      if (!Array.isArray(articleData.tags)) {
        articleData.tags = articleData.tags.split(",").map((t) => t.trim()).slice(0, 5);
      }
      while (articleData.tags.length < 5) {
        articleData.tags.push(`tag${articleData.tags.length + 1}`);
      }
      articleData.tags = articleData.tags.slice(0, 5);
    }

    // Validate description length (150-200 characters)
    if (
      articleData.description.length < 150 ||
      articleData.description.length > 200
    ) {
      console.warn(
        `Description length ${articleData.description.length} not in range 150-200, adjusting...`
      );
      if (articleData.description.length < 150) {
        articleData.description += " " + "Learn more about this topic and discover valuable insights.".slice(0, 150 - articleData.description.length);
      } else {
        articleData.description = articleData.description.substring(0, 200);
      }
    }

    return NextResponse.json(
      {
        statusText: "success",
        data: {
          title: articleData.title,
          description: articleData.description,
          category: articleData.category,
          tags: articleData.tags,
          content: articleData.content,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Professional Content Writer: Internal server error:", error);
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
