"use client";

import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="font-semibold flex items-center gap-1">
      <img src="/logo.png" className="h-6 brightness-125" />
    </Link>
  );
};
export default Logo;
