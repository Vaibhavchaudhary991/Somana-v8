"use client";
import { useSearchParams } from "next/navigation";
import FetchStories from "../articleComponents/FetchStories";

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <div>
      <div className="text-sm font-medium bg-stone-100 p-2 w-fit mb-4 rounded-sm my-1 underline underline-offset-3">
        <p>
          Search -{" "}
          <span className="bg-transparent text-green-700">{query}</span>
        </p>
      </div>

      <div className="col-span-5 flex w-full">
        <div className="flex flex-col gap-4 w-full">
          <FetchStories q={query} />
        </div>
      </div>
    </div>
  );
}
