import Link from "next/link";
import React from "react";

const NavBarButton = ({ href = "/", children }) => {
  return (
    <Link 
      href={href} 
      className="p-1.5 px-4 rounded-t-sm transition-all duration-300 ease-in-out hover:bg-blue-50 hover:scale-105 hover:text-blue-600 hover:shadow-md transform"
    >
      {children}
    </Link>
  );
};

export default NavBarButton;
