import Link from "next/link";
import React from "react";

const NavButton = ({ href = "/", children }) => {
  return (
    <Link
      href={href}
      className="hover:underline border-l px-4 underline-offset-8 decoration-red-600"
    >
      {children}
    </Link>
  );
};

export default NavButton;
