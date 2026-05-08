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

const fetchArticles = async ({ queryKey }) => {
  const [_, genre] = queryKey;
  const url = genre
    ? `/api/v1/blogs?limit=1&genre=${genre}`
    : "/api/v1/blogs?limit=1";
  const res = await axios.get(url);
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

const BestArticle = ({ genre }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bestarticle", genre],
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
              className="bg-card w-full h-full block overflow-hidden rounded-xl group relative"
            >
              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end h-full">
                 <p
                className={`${lora.className} text-white text-center text-3xl font-medium mb-2 drop-shadow-lg`}
              >
                {post.heading}
              </p>
              <p
                className={`${lora.className} text-gray-200 text-center text-base line-clamp-2 font-medium mb-2 drop-shadow-md`}
              >
                {post.description}
              </p>
              </div>

              <div className="relative h-full w-full bg-muted">
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
