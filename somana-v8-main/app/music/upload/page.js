import Warning from "@/app/_components/main/Warning";
import UploadMusic from "@/app/_components/musicComponents/UploadMusic";
import { auth } from "@/app/_lib/auth";
import React from "react";

const page = async () => {
  const session = await auth();
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hostname = process.env.HOSTNAME;

  return (
    <div className="px-2 my-10 mt-24 flex justify-center">
      <div className="w-[1200px]">
        {session.user.role === "admin" || session.user.role === "guide" ? (
          <UploadMusic
            session={session}
            supabaseURL={supabaseURL}
            hostname={hostname}
          />
        ) : (
          <Warning
            heading="You have no permission to upload music"
            description="Only admins and guides can upload music, you can contact Somana Team to get permission."
          />
        )}
      </div>
    </div>
  );
};

export default page;
