import AddComment from "@/app/_components/articleComponents/AddComment";
import BlogComments from "@/app/_components/articleComponents/BlogComments";
import DeleteButton from "@/app/_components/articleComponents/DeleteBlog";
import IFrameViewer from "@/app/_components/articleComponents/IFrameViewer";
import LikeButton from "@/app/_components/articleComponents/LikeButton";
import VerticalAd from "@/app/_components/googleads/vertical_ad";
import { auth } from "@/app/_lib/auth";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { Lora, Roboto_Slab } from "next/font/google";
import Link from "next/link";
import React from "react";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const crimsonText = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const fetchBlogData = async (slug) => {
  if (!slug) return null;

  try {
    const baseUrl =
      process.env.HOSTNAME ||
      process.env.NEXT_PUBLIC_HOSTNAME ||
      "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/v1/blogs/slug/${slug}`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      console.error("Fetch failed:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await fetchBlogData(slug);

  if (!blog) {
    return {
      title: "Not Found",
      description: "The blog post you are looking for does not exist.",
    };
  }

  return {
    title: `${blog.heading} - My Blog`,
    description: blog.description,
    openGraph: {
      title: blog.heading,
      description: blog.description,
      images: [blog.featuredImage],
      url: `${process.env.HOSTNAME}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.heading,
      description: blog.description,
      image: blog.featuredImage,
    },
  };
}

const Page = async ({ params }) => {
  const { slug } = await params;
  const article = await fetchBlogData(slug);
  const session = await auth();

  if (!article) {
    return (
      <div className="mt-44 text-center text-red-600">Blog not found.</div>
    );
  }

  const modifiedContent = article.content?.replace(/target="_blank"/g, "");

  return (
    <div className="mt-44 flex flex-col items-center p-1">
      <div className="w-full max-w-[860px] flex flex-col items-center">
        {/* <VerticalAd /> */}
        <p className="text-sm border w-fit rounded-full px-4 py-1.5 border-stone-600">
          {article?.genre}
        </p>

        <p
          className={`${lora.className} mt-6 text-stone-800 text-center text-5xl font-medium tracking-tight w-full max-w-[600px] leading-tight`}
        >
          {article.heading}
        </p>

        <p
          className={`${crimsonText.className} mt-2 text-black font-medium text-center text-xl tracking-tighter w-full max-w-[600px]`}
        >
          {article.description}
        </p>
        <div className="my-4 flex items-center gap-4">
          {session?.user ? (
            <LikeButton
              blogId={slug}
              initialLikes={article.likesCount}
              userId={session.user.userId}
            />
          ) : null}
          <p className="font-medium  dark:bg-gray-800 p-1 px-2 rounded-md text-sm">
            {article.viewsCount} views
          </p>

          {session &&
            (session.user.userId === article.author._id ||
              session.user.role === "admin") && (
              <div className="flex items-center gap-2">
                {article?._id && (
                  <Link href={`/story/edit/${article._id}`}>
                    <Button variant="secondary" size="sm">
                      <Pen weight="bold" />
                      Edit
                    </Button>
                  </Link>
                )}
                <DeleteButton blogId={article._id} />
              </div>
            )}
        </div>

        <Link href={`/user/${article?.author?.userName}`}>
          <div className="mt-4 flex flex-col items-center">
            <img
              className="rounded-full aspect-square size-8"
              src={article.author?.photo}
              alt={article.author?.name}
            />
            <p className="font-semibold text-sm mt-1">{article.author?.name}</p>
          </div>
        </Link>
        {article?.genre === "Notes" ? (
          ""
        ) : (
          <div className="w-full mt-6">
            <img
              className="rounded-md w-full"
              src={article.featuredImage}
              alt="Featured"
            />
          </div>
        )}

        {article?.fileLinks?.length > 0 ? (
          <IFrameViewer fileLinks={article.fileLinks} />
        ) : (
          ""
        )}

        <div className="grid grid-cols-6">
          <div
            className={`${crimsonText.className} font-medium col-span-5 leading-normal my-10 custom-link text-xl text-gray-900 dark:text-gray-200`}
            dangerouslySetInnerHTML={{ __html: modifiedContent }}
          ></div>
        </div>
        <div className="mt-20 w-full">
          {session?.user ? (
            <AddComment
              session={session}
              hostname={process.env.HOSTNAME}
              blogId={article._id}
              authorId={session.user.userId}
            />
          ) : (
            <p className="text-gray-500">Log in to comment on this blog.</p>
          )}
          <BlogComments hostname={process.env.HOSTNAME} blogId={article._id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
