import React from "react";
import Logo from "./Logo";
import Nav from "./Nav";
import EndNav from "./EndNav";
import { auth } from "@/app/_lib/auth";

const Header = async () => {
  const session = await auth();
  return (
    <div className="py-2 px-4 bg-white flex flex-col items-center shadow-xs">
      <div className="flex items-center gap-4 w-full">
        <Logo />
        <Nav />
        <EndNav session={session} />
      </div>
    </div>
  );
};

export default Header;
