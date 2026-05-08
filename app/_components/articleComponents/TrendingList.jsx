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
    ? `/api/v1/blogs?limit=4&genre=${genre}`
    : "/api/v1/blogs?limit=4";
  const res = await axios.get(url);
  return res?.data?.data?.blogs;
};

// Skeleton Loader
const SkeletonCard = () => (
  <div className="flex items-center gap-4 animate-pulse bg-card rounded-lg p-2">
    {/* Skeleton Image */}
    <div className="min-w-[72px] min-h-[72px] w-16 h-16 bg-muted rounded" />

    {/* Skeleton Text */}
    <div className="flex flex-col gap-2 flex-1">
      <div className="w-16 h-4 bg-muted rounded" />
      <div className="w-3/4 h-5 bg-muted rounded" />
    </div>
  </div>
);

const TrendingList = ({ genre }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trendArticles", genre],
    queryFn: fetchArticles,
  });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 w-full">
        {isLoading
          ? [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          : data?.map((post) => (
              <Link
                href={`/story/${post.slug}`}
                key={post._id}
                className="flex items-center gap-4 transition-all duration-300 bg-card/50 hover:bg-card p-2 rounded-xl border border-transparent hover:border-white/5 hover:shadow-lg group"
              >
                {/* Image Section */}
                <div className="min-w-[72px] min-h-[72px] w-16 h-16 relative overflow-hidden rounded-lg bg-muted">
                  <img
                    src={post.featuredImage}
                    alt={post.heading}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Text Section */}
                <div className="flex flex-col justify-center overflow-hidden flex-1">
                  <div className="flex gap-2 mb-1">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-primary">
                      {post.genre}
                    </p>
                  </div>
                  <p
                    className={`${lora.className} text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors`}
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
