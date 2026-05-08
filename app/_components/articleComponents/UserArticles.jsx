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

const fetchUserArticles = async (authorID, limit) => {
  const res = await axios.get(
    `/api/v1/blogs?authorID=${authorID}&limit=${limit}`
  );
  return res.data?.data?.blogs;
};

const UserArticles = ({ userId, apiLimit = 10 }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userArticles", userId],
    queryFn: () => fetchUserArticles(userId, apiLimit),
    enabled: !!userId,
  });

  if (error)
    return (
      <p className="text-center text-red-500">Login and write some Stories</p>
    );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {data?.map((post) => (
          <Link
            href={`/story/${post.slug}`}
            key={post._id}
            className="bg-white dark:bg-neutral-900"
          >
            <div className="relative h-32 bg-neutral-100 dark:bg-neutral-800">
              <img
                src={post.featuredImage}
                alt={post.heading}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <p className="text-xs px-2 rounded-full border w-fit mt-1">
              {post.tags}
            </p>
            <div>
              <p
                className={`${lora.className} text-black dark:text-white font-medium mt-1`}
              >
                {post.heading}
              </p>
              <p
                className={`${lora.className} text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2 mt-2`}
              >
                {post.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserArticles;
