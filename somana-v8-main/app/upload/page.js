import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center my-12">
      <div className="w-full max-w-[1200px] px-2">
        <div className="flex items-center gap-4 mb-96">
          <Link
            href="/story/write"
            className="text-sm bg-neutral-100 border rounded p-1 px-2 font-medium"
          >
            Write Story
          </Link>
          <Link
            href="/podcast/upload"
            className="text-sm bg-neutral-100 border rounded p-1 px-2 font-medium"
          >
            Upload Podcast
          </Link>
          <Link
            href="/music/upload"
            className="text-sm bg-neutral-100 border rounded p-1 px-2 font-medium"
          >
            Upload Music
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
