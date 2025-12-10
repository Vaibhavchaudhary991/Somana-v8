import UpdateBlog from "@/app/_components/articleComponents/UpdateBlog";
import { auth } from "@/app/_lib/auth";

const Page = async ({ params }) => {
  const session = await auth();
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hostname = process.env.HOSTNAME;
  return (
    <div className="my-2 mt-6 flex justify-center">
      <div className="w-[1200px]">
        <UpdateBlog
          storyId={params.storyId}
          session={session}
          supabaseURL={supabaseURL}
          hostname={hostname}
        />
      </div>
    </div>
  );
};
export default Page;
