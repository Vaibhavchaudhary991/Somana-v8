import { Separator } from "@/components/ui/separator";
import React from "react";
import NavBarButton from "../buttons/NavBarButton";

const NavBar = () => {
  return (
    <div className="flex items-center">
      <NavBarButton href="/">U.S.</NavBarButton>
      <Separator orientation="vertical" />
      <NavBarButton href="/">Europe</NavBarButton>
      <Separator orientation="vertical" />
      <NavBarButton href="/">World</NavBarButton>
      <Separator orientation="vertical" />
      <NavBarButton href="/">Era & Ages</NavBarButton>
      <Separator orientation="vertical" />
      <NavBarButton href="/">Culture</NavBarButton>
      <Separator orientation="vertical" />
      <NavBarButton href="/">Science</NavBarButton>
      <Separator orientation="vertical" />
      <NavBarButton href="/">Space</NavBarButton>
    </div>
  );
};
export default NavBar;
