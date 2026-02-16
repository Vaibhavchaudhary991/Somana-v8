"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PlayCircle } from "lucide-react";
import { Lora } from "next/font/google";
import MusicPlayer from "./MusicPlayer"; // Make sure this exists

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fetchMusic = async () => {
  const res = await axios.get("/api/v1/music?limit=15");
  return res?.data?.data?.tracks;
};

// Skeleton for loading state
const SkeletonCard = () => (
  <div className="flex items-center gap-4 animate-pulse">
    <div className="min-w-[72px] min-h-[72px] w-16 h-16 bg-gray-300 dark:bg-neutral-700 rounded" />
    <div className="flex flex-col gap-2 flex-1">
      <div className="w-20 h-4 bg-gray-300 dark:bg-neutral-700 rounded" />
      <div className="w-3/4 h-5 bg-gray-300 dark:bg-neutral-700 rounded" />
    </div>
  </div>
);

const MusicHorizontalList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["music"],
    queryFn: fetchMusic,
  });
  // console.log(data);
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 w-full">
        {isLoading
          ? Array.from({ length: 12 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          : data?.map((track) => (
              <MusicPlayer
                key={track._id}
                audioUrl={track.audioLink}
                image={track.featuredImage}
                title={track.musicName}
                trackId={track.id}
                trigger={
                  <div className="flex items-center gap-4 cursor-pointer group">
                    <div className="min-w-[72px] min-h-[72px] w-16 h-16 relative overflow-hidden rounded-lg bg-muted group-hover:shadow-lg transition-all duration-300">
                      <img
                        src={track.featuredImage}
                        alt={track.musicName}
                        className="object-cover rounded-lg w-full h-full group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <PlayCircle size={24} className="text-white drop-shadow-md group-hover:scale-110 transition-transform" />
                      </div>
                    </div>

                    <div className="flex flex-col justify-center overflow-hidden flex-1">
                      <div className="flex gap-2 mb-1">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-primary border border-primary/20 bg-primary/5 px-1.5 py-0.5 rounded">
                          {track.musicType}
                        </p>
                      </div>
                      <p
                        className={`${lora.className} text-sm font-medium text-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors`}
                      >
                        {track.musicName}
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

export default MusicHorizontalList;
