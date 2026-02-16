"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

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
  const params = useParams();
  const activeTag = params?.topic || "All";
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
    <div className="relative w-full group">
      {/* Left Scroll Button */}
      {showLeft && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md border border-white/10 shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Scrollable Tag List */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar py-2 px-1"
      >
        {tags.map((tag) => (
          <Link key={tag} href={`/story/topic/${tag}`} className="no-underline">
            <div
              className={`
                px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer border
                ${
                  activeTag === tag
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary),0.4)]"
                    : "bg-secondary/50 text-muted-foreground border-transparent hover:border-primary/30 hover:bg-secondary hover:text-primary hover:shadow-lg"
                }
              `}
            >
              {tag}
            </div>
          </Link>
        ))}
      </div>

      {/* Right Scroll Button */}
      {showRight && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md border border-white/10 shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
