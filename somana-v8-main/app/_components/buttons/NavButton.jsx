import Link from "next/link";
import React from "react";

const NavButton = ({ href = "/", children }) => {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_10px_rgba(var(--primary),0.2)]"
    >
      {children}
    </Link>
  );
};

export default NavButton;
