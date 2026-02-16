import React from "react";
import { auth } from "../_lib/auth";
import { redirect } from "next/navigation";
import CurrentUserProfile from "../_components/userComponents/CurrentUserProfile";

const page = async () => {
  const session = await auth();
  
  // Redirect to login if not authenticated
  if (!session || !session.user) {
    redirect("/login");
  }
  
  return <CurrentUserProfile session={session} />;
};

export default page;
