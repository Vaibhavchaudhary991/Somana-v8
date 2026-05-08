import React from "react";
import Logo from "./Logo";
import Nav from "./Nav";
import EndNav from "./EndNav";
import DarkModeToggle from "./DarkModeToggle";
import { auth } from "@/app/_lib/auth";

const Header = async () => {
  const session = await auth();
  return (
    <div className="py-3 px-4 bg-background/80 backdrop-blur-md border-b border-white/5 flex flex-col items-center transition-colors duration-300">
      <div className="flex items-center gap-4 w-full">
        <Logo />
        <Nav />
        <EndNav session={session} />
        <DarkModeToggle />
      </div>
    </div>
  );
};

export default Header;
