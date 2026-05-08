"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Lora } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fetchArticles = async () => {
  const res = await axios.get("/api/v1/blogs?limit=2");
  return res?.data?.data?.blogs;
};

const SkeletonQuote = () => (
  <div className="flex items-center gap-4 bg-white dark:bg-neutral-900 p-2 rounded animate-pulse">
    {/* Image skeleton */}
    <div className="min-w-[100px] min-h-[100px] w-24 h-24 bg-gray-300 dark:bg-neutral-700 rounded" />

    {/* Text skeletons */}
    <div className="flex flex-col justify-center gap-2 flex-1">
      <div className="w-3/4 h-5 bg-gray-300 dark:bg-neutral-700 rounded" />
      <div className="w-1/4 h-4 bg-gray-300 dark:bg-neutral-700 rounded" />
    </div>
  </div>
);

const Quotes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles3"],
    queryFn: fetchArticles,
  });

  const [revealed, setRevealed] = useState({});

  const handleReveal = (id) => {
    setRevealed((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 w-full">
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => <SkeletonQuote key={i} />)
          : data?.map((post) => {
              const isRevealed = revealed[post._id];
              return (
                <div
                  key={post._id}
                  className="flex items-center gap-4 transition bg-white dark:bg-neutral-900 p-2 rounded"
                >
                  {/* Image with reveal blur */}
                  <div className="min-w-[100px] min-h-[100px] w-24 h-24 relative overflow-hidden rounded bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src={post.featuredImage}
                      alt={post.heading}
                      className={`object-cover w-full h-full transition-all duration-300 ${
                        isRevealed ? "blur-0" : "blur-md scale-105"
                      }`}
                    />
                    {!isRevealed && (
                      <button
                        onClick={() => handleReveal(post._id)}
                        className="absolute cursor-pointer inset-0 flex items-center justify-center text-xs font-semibold text-white bg-black/40 backdrop-blur-sm"
                      >
                        Reveal
                      </button>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col justify-center overflow-hidden">
                    <p
                      className={`${lora.className} text-base font-medium text-black dark:text-white mt-1 line-clamp-3`}
                    >
                      “ {post.heading} ”
                    </p>

                    {isRevealed ? (
                      <p className="text-sm mt-1 text-neutral-600 dark:text-neutral-400">
                        {post.name || "Author"}
                      </p>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Quotes;
