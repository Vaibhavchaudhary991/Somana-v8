"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const tags = [
  "Notes",
  "Blog",
  "Automotive",
  "Beauty",
  "Books",
  "Business",
  "Career",
  "Cryptocurrency",
  "Culture",
  "Crafts",
  "Design",
  "Education",
  "Entertainment",
  "Environmental",
  "Fashion",
  "Finance",
  "Fitness",
  "Food",
  "Gaming",
  "Gardening",
  "Health",
  "History",
  "Home",
  "Humor",
  "Interests",
  "Investing",
  "Legal",
  "Lifestyle",
  "Luxury",
  "Marketing",
  "Movies",
  "Music",
  "News",
  "Nonprofit",
  "Parenting",
  "Pets",
  "Photography",
  "Politics",
  "Estate",
  "Relationships",
  "Science",
  "Shopping",
  "Social",
  "Space",
  "Spirituality",
  "Sports",
  "Startups",
  "Story",
  "Technology",
  "Tips",
  "Travel",
  "Volunteer",
  "Writing",
];
export default function TagSlider() {
  const [activeTag, setActiveTag] = useState("All");
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  // Check scroll position
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 1); // -1 for precision
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Update button visibility on mount and scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Left Scroll Button */}
      {showLeft && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex">
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-neutral-100"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </Button>
        </div>
      )}

      {/* Scrollable Tag List */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth no-scrollbar"
      >
        {tags.map((tag) => (
          <Link key={tag} href={`/story/topic/${tag}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTag(tag)}
              className={`whitespace-nowrap cursor-pointer text-sm border transition-colors ${
                activeTag === tag ? "border-black font-semibold" : ""
              }`}
            >
              {tag}
            </Button>
          </Link>
        ))}
      </div>

      {/* Right Scroll Button */}
      {showRight && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex">
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-neutral-100"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </Button>
        </div>
      )}
    </div>
  );
}
