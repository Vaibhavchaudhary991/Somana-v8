import dynamic from 'next/dynamic';
import Warning from "@/app/_components/main/Warning";
import { auth } from "@/app/_lib/auth";
import React from "react";

// Lazy load UploadMusic component
const UploadMusic = dynamic(() => import("@/app/_components/musicComponents/UploadMusic"), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-10 bg-gray-200 rounded w-1/3" />
      <div className="h-40 bg-gray-200 rounded" />
      <div className="h-10 bg-gray-200 rounded w-1/4" />
    </div>
  )
});

const page = async () => {
  const session = await auth();
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hostname = process.env.HOSTNAME;

  return (
    <div className="my-2 flex justify-center">
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
