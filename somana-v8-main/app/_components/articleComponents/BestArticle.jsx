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
  const res = await axios.get("/api/v1/blogs?limit=1");
  return res?.data?.data?.blogs;
};

const SkeletonCard = () => {
  return (
    <div className="w-full animate-pulse flex flex-col gap-4">
      <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
      <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
      <div className="w-full min-h-90 h-full bg-gray-300 rounded"></div>
    </div>
  );
};

const BestArticle = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bestarticle"],
    queryFn: fetchArticles,
  });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 w-full">
        {isLoading ? (
          <SkeletonCard />
        ) : (
          data?.map((post) => (
            <Link
              href={`/story/${post.slug}`}
              key={post._id}
              className="bg-white overflow-hidden"
            >
              <p
                className={`${lora.className} text-black text-center text-3xl font-medium mb-2`}
              >
                {post.heading}
              </p>
              <p
                className={`${lora.className} text-black text-center text-base line-clamp-2 font-medium mb-2`}
              >
                {post.description}
              </p>

              <div className="relative h-full bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={post.featuredImage}
                  alt={post.heading}
                  className="w-full min-h-90 h-full object-cover rounded"
                />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default BestArticle;
