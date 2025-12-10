import UserDataTabs from "@/app/_components/userComponents/UserDataTabs";
import UserProfile from "@/app/_components/userComponents/UserProfile";
import axios from "axios";

const fetchUserProfile = async (username) => {
  const res = await axios.get(
    `${process.env.HOSTNAME}/api/v1/users/userName/${username}`
  );
  return res.data?.data;
};

const Page = async ({ params }) => {
  const { username } = await params;

  const userProfile = await fetchUserProfile(username);

  if (!userProfile) {
    return <p className="text-center text-red-500">User not found</p>;
  }

  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[1200px]">
        <div className="px-1">
          <UserProfile userProfile={userProfile} />
        </div>
        <div className="mt-6">
          <UserDataTabs userId={userProfile?._id} />
        </div>
      </div>
    </div>
  );
};

export default Page;
