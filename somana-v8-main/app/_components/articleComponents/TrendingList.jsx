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
  const res = await axios.get("/api/v1/blogs?limit=4");
  return res?.data?.data?.blogs;
};

// Skeleton Loader
const SkeletonCard = () => (
  <div className="flex items-center gap-4 animate-pulse bg-white">
    {/* Skeleton Image */}
    <div className="min-w-[72px] min-h-[72px] w-16 h-16 bg-gray-300 rounded" />

    {/* Skeleton Text */}
    <div className="flex flex-col gap-2 flex-1">
      <div className="w-16 h-4 bg-gray-300 rounded" />
      <div className="w-3/4 h-5 bg-gray-300 rounded" />
    </div>
  </div>
);

const TrendingList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trendArticles"],
    queryFn: fetchArticles,
  });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 w-full">
        {isLoading
          ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          : data?.map((post) => (
              <Link
                href={`/story/${post.slug}`}
                key={post._id}
                className="flex items-center gap-4 transition bg-white"
              >
                {/* Image Section */}
                <div className="min-w-[72px] min-h-[72px] w-16 h-16 relative overflow-hidden rounded bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={post.featuredImage}
                    alt={post.heading}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Text Section */}
                <div className="flex flex-col justify-center overflow-hidden">
                  <div className="flex gap-2">
                    <p className="text-xs bg-gray-100 px-2 rounded-sm border border-neutral-300 dark:border-neutral-600 w-fit text-neutral-700 dark:text-neutral-300">
                      {post.genre}
                    </p>
                    <p className="text-xs px-2 rounded-sm border border-neutral-300 dark:border-neutral-600 w-fit text-neutral-700 dark:text-neutral-300">
                      {post.tags}
                    </p>
                  </div>
                  <p
                    className={`${lora.className} text-sm font-medium text-black dark:text-white mt-1 line-clamp-2`}
                  >
                    {post.heading}
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default TrendingList;
