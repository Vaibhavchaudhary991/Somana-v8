import FullMusic from "@/app/_components/musicComponents/FullMusic";
import MusicHorizontalList from "@/app/_components/musicComponents/MusicHorizontalList";
import React from "react";

const page = async ({ params }) => {
  const { id } = await params;
  return (
    <div className="flex flex-col items-center my-4">
      <div className="w-full max-w-[1200px] px-2">
        <FullMusic id={id} />
      </div>
    </div>
  );
};

export default page;
