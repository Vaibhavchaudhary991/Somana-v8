"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Lora } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

// Font
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Skeleton loader
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

// Fetch blogs
const fetchArticles = async ({ queryKey }) => {
  const [_key, page, topic] = queryKey;
  const limit = 8;
  const res = await axios.get(
    `/api/v1/blogs?page=${page}&limit=${limit}&genre=${topic}`
  );
  const blogs = res.data?.data?.blogs || [];

  return {
    blogs,
    hasMore: blogs.length === limit,
  };
};

const ArticleGrid2 = ({ topic }) => {
  const [page, setPage] = useState(1);
  const limit = 8;
  const maxButtonsToShow = 8;

  const { data, isLoading } = useQuery({
    queryKey: ["articles", page, topic],
    queryFn: fetchArticles,
    keepPreviousData: true,
  });

  const blogs = data?.blogs || [];
  const hasMore = data?.hasMore;

  const [lastKnownPage, setLastKnownPage] = useState(8); // start with 8 buttons always

  useEffect(() => {
    if (hasMore && page >= lastKnownPage) {
      setLastKnownPage((prev) => Math.max(prev, page + 1));
    }
  }, [hasMore, page, lastKnownPage]);

  // Get visible pages (always 8)
  const getVisiblePages = () => {
    const pages = [];
    const middle = Math.floor(maxButtonsToShow / 2);

    let start = Math.max(1, page - middle + 1);

    if (start + maxButtonsToShow - 1 > lastKnownPage) {
      start = Math.max(1, lastKnownPage - maxButtonsToShow + 1);
    }

    for (let i = 0; i < maxButtonsToShow; i++) {
      const pageNum = start + i;
      pages.push(pageNum);
    }

    return pages;
  };

  return (
    <div className="w-full">
      {/* Blog grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : blogs.map((post) => (
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

      {/* Pagination */}
      <div className="flex justify-center mt-10 mb-6">
        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                variant="outline"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50 cursor-pointer"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {/* Page Numbers */}
            {getVisiblePages().map((p) => (
              <PaginationItem key={p}>
                <Button
                  variant={p === page ? "default" : "outline"}
                  onClick={() => setPage(p)}
                  className="cursor-pointer"
                  size="icon"
                >
                  {p}
                </Button>
              </PaginationItem>
            ))}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (hasMore) {
                    setPage((prev) => prev + 1);
                  }
                }}
                className={
                  !hasMore
                    ? "pointer-events-none opacity-50 cursor-pointer"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ArticleGrid2;
