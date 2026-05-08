"use client";
import { Badge } from "@/components/ui/badge";
import { getBadge, getLevel } from "@/app/_utils/xpSystem";
import clsx from "clsx";
import React, { use } from "react";
import { useUser } from "@/app/_context/UserContext";

// Custom badge style map
const badgeStyles = {
  Newbie: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
  Contributor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "Rising Star":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "Pro Creator":
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Mastermind: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Legendary:
    "bg-yellow-100 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-200",
};

const XPBadgeHeader = () => {
  const user = useUser();

  const level = getLevel(user?.user?.xp);
  const badge = getBadge(user?.user?.level);

  return (
    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm p-1 rounded-md border">
      <Badge
        className={clsx(
          "px-3 sm:text-sm font-semibold",
          badgeStyles[badge] || "bg-gray-100 text-gray-700"
        )}
      >
        {badge}
      </Badge>
      <div className="text-muted-foreground font-medium">Level {level}</div>
      <div className="text-muted-foreground">{user?.user?.xp} XP</div>
    </div>
  );
};

export default XPBadgeHeader;
