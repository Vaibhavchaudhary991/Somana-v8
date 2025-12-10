import WriteBlog from "@/app/_components/articleComponents/WriteBlog";
import Warning from "@/app/_components/main/Warning";
import { auth } from "@/app/_lib/auth";
import React from "react";

const page = async () => {
  const session = await auth();
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hostname = process.env.HOSTNAME;

  return (
    <div className="my-2 flex justify-center">
      <div className="w-[1200px]">
        {session.user.role === "admin" || session.user.role === "guide" ? (
          <WriteBlog
            session={session}
            supabaseURL={supabaseURL}
            hostname={hostname}
          />
        ) : (
          <Warning
            heading="You have no permission to write stories"
            description="Only admins and guides can write stories, you can contact Somana Team to get permission."
          />
        )}
      </div>
    </div>
  );
};

export default page;
