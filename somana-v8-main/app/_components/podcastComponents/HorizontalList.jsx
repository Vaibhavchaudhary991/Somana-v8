"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PlayCircle } from "lucide-react";
import { Lora } from "next/font/google";
import PodcastPlayer from "./PodcastPlayer";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fetchPodcasts = async () => {
  const res = await axios.get("/api/v1/podcasts?limit=9");
  return res?.data?.data?.podcasts;
};

// Skeleton Card
const SkeletonCard = () => (
  <div className="flex items-center gap-4 animate-pulse">
    {/* Image skeleton */}
    <div className="min-w-[72px] min-h-[72px] w-16 h-16 bg-gray-300 dark:bg-neutral-700 rounded" />

    {/* Text skeleton */}
    <div className="flex flex-col gap-2 flex-1">
      <div className="w-20 h-4 bg-gray-300 dark:bg-neutral-700 rounded" />
      <div className="w-3/4 h-5 bg-gray-300 dark:bg-neutral-700 rounded" />
    </div>
  </div>
);

const HorizontalList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["podcasts"],
    queryFn: fetchPodcasts,
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {isLoading
          ? Array.from({ length: 9 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : data?.map((podcast) => (
              <PodcastPlayer
                key={podcast._id}
                audioUrl={podcast.audioLink}
                image={podcast.featuredImage}
                title={podcast.podcastName}
                description={podcast.description}
                trigger={
                  <div className="flex items-center gap-4 cursor-pointer">
                    <div className="min-w-[72px] min-h-[72px] w-16 h-16 relative overflow-hidden rounded bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={podcast.featuredImage}
                        alt={podcast.podcastName}
                        className="object-cover rounded w-full h-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <PlayCircle size={20} fill="true" color="white" />
                      </div>
                    </div>

                    <div className="flex flex-col justify-center overflow-hidden">
                      <div className="flex gap-2">
                        <p className="text-xs  px-2 rounded-sm border border-neutral-300 dark:border-neutral-600 w-fit text-neutral-700 dark:text-neutral-300">
                          {podcast.podcastType}
                        </p>
                      </div>
                      <p
                        className={`${lora.className} text-sm font-medium text-black dark:text-white mt-1 line-clamp-2`}
                      >
                        {podcast.podcastName}
                      </p>
                    </div>
                  </div>
                }
              />
            ))}
      </div>
    </div>
  );
};

export default HorizontalList;
