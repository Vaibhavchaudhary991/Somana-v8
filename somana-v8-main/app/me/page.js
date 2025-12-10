import React from "react";
import { auth } from "../_lib/auth";
import CurrentUserProfile from "../_components/userComponents/CurrentUserProfile";

const page = async () => {
  const session = await auth();
  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[1200px]">
        <div className="px-1">
          <CurrentUserProfile session={session} />
        </div>
      </div>
    </div>
  );
};

export default page;
