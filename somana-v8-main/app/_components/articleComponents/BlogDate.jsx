import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

const BlogDate = ({ blogDate, className }) => {
  const dateString = blogDate;
  const dateObj = new Date(dateString);
  const today = new Date();

  const differenceInMs = today - dateObj; // Difference in milliseconds
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24)); // Convert to days

  let displayDate;

  if (differenceInDays === 0) {
    displayDate = "Today";
  } else if (differenceInDays === 1) {
    displayDate = "Yesterday";
  } else if (differenceInDays <= 6) {
    displayDate = `${differenceInDays} days ago`;
  } else {
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = String(dateObj.getFullYear());
    displayDate = `${day}-${month}-${year}`;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className={`${className} px-0`}>{displayDate}</p>
        </TooltipTrigger>
        <TooltipContent>
          <p>This story written on {displayDate}.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BlogDate;
