import { Separator } from "@/components/ui/separator";
import React from "react";
import NavButton from "../buttons/NavButton";

const Nav = () => {
  return (
    <div className="flex items-center text-xs font-medium">
      <NavButton href="/">Podcast</NavButton>
      <Separator orientation="vertical" />
      <NavButton href="/">Music</NavButton>
      <Separator orientation="vertical" />
      <NavButton href="/">Playlists</NavButton>
      <Separator orientation="vertical" />
      <NavButton href="/">Tales</NavButton>
      <Separator orientation="vertical" />
      <NavButton href="/">New</NavButton>
      <Separator orientation="vertical" />
      <NavButton href="/">Special</NavButton>
    </div>
  );
};

export default Nav;
