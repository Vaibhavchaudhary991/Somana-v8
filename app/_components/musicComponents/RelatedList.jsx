"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PlayCircle } from "lucide-react";
import { Lora } from "next/font/google";
import MusicPlayer from "./MusicPlayer";
import HeaderButton from "../buttons/HeaderButton";
import Link from "next/link";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fetchMusic = async ({ queryKey }) => {
  const [, genre] = queryKey;
  const res = await axios.get(`/api/v1/music?limit=15&musicType=${genre}`);
  return res?.data?.data?.tracks;
};

const SkeletonCard = () => (
  <div className="flex items-center gap-4 animate-pulse">
    <div className="min-w-[72px] min-h-[72px] w-16 h-16 bg-gray-300 dark:bg-neutral-700 rounded" />
    <div className="flex flex-col gap-2 flex-1">
      <div className="w-20 h-4 bg-gray-300 dark:bg-neutral-700 rounded" />
      <div className="w-3/4 h-5 bg-gray-300 dark:bg-neutral-700 rounded" />
    </div>
  </div>
);

const RelatedList = ({ genre }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["music2", genre],
    queryFn: fetchMusic,
    enabled: !!genre,
  });

  if (error) {
    return (
      <div className="text-center text-red-500 text-sm">
        Failed to load music.
      </div>
    );
  }

  return (
    <div className="w-full">
      <HeaderButton>Related Music | {genre}</HeaderButton>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 w-full">
        {isLoading
          ? Array.from({ length: 12 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : data?.map((track) => (
              <Link href={`/music/${track.id}`}>
                <div className="flex items-center gap-4 cursor-pointer">
                  <div className="min-w-[72px] min-h-[72px] w-16 h-16 relative overflow-hidden rounded ">
                    <img
                      src={track.featuredImage}
                      alt={track.musicName}
                      className="object-cover rounded w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center ">
                      <PlayCircle size={20} fill color="white" />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center overflow-hidden">
                    <p className="text-xs px-2 rounded-full border border-neutral-300 w-fit text-neutral-700">
                      {track.musicType}
                    </p>
                    <p
                      className={`${lora.className} text-sm font-medium text-black dark:text-white mt-1 line-clamp-2`}
                    >
                      {track.musicName}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default RelatedList;
