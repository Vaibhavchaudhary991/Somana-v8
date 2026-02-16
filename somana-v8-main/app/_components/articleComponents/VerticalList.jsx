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
    ? `/api/v1/blogs?limit=2&genre=${genre}`
    : "/api/v1/blogs?limit=2";
  const res = await axios.get(url);
  return res?.data?.data?.blogs;
};

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="bg-white overflow-hidden animate-pulse flex flex-col gap-2">
    <div className="relative h-32 bg-gray-300 rounded"></div>
    <div className="h-4 w-16 bg-gray-300 rounded mt-2"></div>
    <div className="h-5 w-3/4 bg-gray-300 rounded mt-2"></div>
  </div>
);

const VerticalList = ({ genre }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles1", genre],
    queryFn: fetchArticles,
  });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 w-full">
        {isLoading
          ? [1, 2].map((i) => <SkeletonCard key={i} />)
          : data?.map((post) => (
              <Link
                href={`/story/${post.slug}`}
                key={post._id}
                className="bg-card hover:bg-card/80 transition-colors overflow-hidden rounded-lg group"
              >
                <div className="relative h-32 bg-muted">
                  <img
                    src={post.featuredImage}
                    alt={post.heading}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex gap-2 mt-2 px-1">
                  <p className="text-xs bg-secondary px-2 py-0.5 rounded-md border border-border text-muted-foreground">
                    {post.genre}
                  </p>
                  <p className="text-xs px-2 py-0.5 rounded-md border border-border text-muted-foreground">
                    {post.tags}
                  </p>
                </div>
                <p className={`${lora.className} text-card-foreground font-medium mt-2 px-1 line-clamp-2 group-hover:text-primary transition-colors`}>
                  {post.heading}
                </p>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default VerticalList;
