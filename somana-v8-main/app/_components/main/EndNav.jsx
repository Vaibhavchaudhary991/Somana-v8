import { Separator } from "@/components/ui/separator";
import {
  PenBoxIcon,
  PenIcon,
  PenSquare,
  Search,
  Sparkle,
  User,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import SearchInput from "./SearchInput";
import { Button } from "@/components/ui/button";
import { auth } from "@/app/_lib/auth";
import XPBadgeHeader from "./XPBadgeHeader";

const EndNav = async ({ session }) => {
  return (
    <div className="ml-auto flex gap-2 items-center text-xs font-medium">
      <div className="flex items-center gap-2 mr-2">
        <XPBadgeHeader />
        <SearchInput />
        <Separator orientation="vertical" />
        {session?.user ? (
          <div className="flex items-center gap-2">
            {/* <Link href="/story/write">
              <PenSquare size={16} />
            </Link> */}
            <Link href="/upload">
              <Button variant="outline" className="cursor-pointer" size="sm">
                Upload
              </Button>
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
      {session?.user ? (
        <Link href="/me">
          <img src={session?.user?.photo} className="size-8 rounded-full" />
        </Link>
      ) : (
        <>
          <User size={16} />
          <Separator orientation="vertical" />
          <Link
            href="/login"
            className="text-stone-200 text-sm bg-stone-800 p-1.5 px-3 rounded-full"
          >
            Login
          </Link>
        </>
      )}
    </div>
  );
};

export default EndNav;
