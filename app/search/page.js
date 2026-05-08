export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Search from "../_components/main/Search";

export default function Page() {
  return (
    <div className="flex flex-col items-center my-4">
      <div className="w-full max-w-[1200px] px-2">
        <Search />
      </div>
    </div>
  );
}
