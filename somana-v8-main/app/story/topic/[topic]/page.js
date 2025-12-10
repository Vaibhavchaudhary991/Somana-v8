import ArticleGrid2 from "@/app/_components/articleComponents/ArticleGrid2";
import React from "react";

const page = async ({ params }) => {
  const { topic } = await params;
  return (
    <div className="flex flex-col items-center my-4">
      <div className="w-full max-w-[1200px] px-2">
        <ArticleGrid2 topic={topic} />
      </div>
    </div>
  );
};

export default page;
