import Link from "next/link";
import React from "react";

const NavBarButton = ({ href = "/", children }) => {
  return (
    <Link href={href} className="p-1.5 px-4 hover:bg-stone-100 rounded-t-sm">
      {children}
    </Link>
  );
};

export default NavBarButton;
