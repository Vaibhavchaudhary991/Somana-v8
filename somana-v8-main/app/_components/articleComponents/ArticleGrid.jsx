"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Lora } from "next/font/google";
import Link from "next/link";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fetchArticles = async () => {
  const res = await axios.get("/api/v1/blogs?limit=8");
  return res?.data?.data?.blogs;
};

const SkeletonCard = () => (
  <div className="bg-white overflow-hidden animate-pulse">
    <div className="relative h-32 bg-gray-300 dark:bg-neutral-800 rounded" />
    <div className="mt-2">
      <div className="h-5 w-20 bg-gray-300 dark:bg-neutral-700 rounded mb-2" />
      <div className="h-6 w-3/4 bg-gray-300 dark:bg-neutral-700 rounded mb-3" />
      <div className="h-5 w-full bg-gray-300 dark:bg-neutral-700 rounded mb-2" />
      <div className="h-5 w-5/6 bg-gray-300 dark:bg-neutral-700 rounded" />
    </div>
  </div>
);

const ArticleGrid = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles4"],
    queryFn: fetchArticles,
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : data?.map((post) => (
              <Link
                href={`/story/${post.slug}`}
                key={post._id}
                className="bg-white overflow-hidden"
              >
                <div className="relative h-32 bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={post.featuredImage}
                    alt={post.heading}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex gap-2 mt-1.5">
                  <p className="text-xs bg-gray-100 px-2 rounded-sm border border-neutral-300 dark:border-neutral-600 w-fit text-neutral-700 dark:text-neutral-300">
                    {post.genre}
                  </p>
                  <p className="text-xs px-2 rounded-sm border border-neutral-300 dark:border-neutral-600 w-fit text-neutral-700 dark:text-neutral-300">
                    {post.tags}
                  </p>
                </div>
                <p
                  className={`${lora.className} text-black font-medium mt-1 line-clamp-2`}
                >
                  {post.heading}
                </p>
                <p
                  className={`${lora.className} text-black text-sm line-clamp-2 font-medium mt-2`}
                >
                  {post.description}
                </p>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default ArticleGrid;
