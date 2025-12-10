"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart } from "lucide-react";

const LikeButton = ({ blogId, initialLikes, userId }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkUserLiked = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `/api/v1/blogs/slug/${blogId}?userId=${userId}`
        );
        setLiked(response.data.data.userLiked);
      } catch (error) {
        console.error("Error checking like status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLiked();
  }, [blogId, userId]);

  const handleLike = async () => {
    if (!userId || loading) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `/api/v1/blogs/slug/${blogId}?userId=${userId}&action=like`
      );
      setLikes(response.data.data.likesCount);
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking the blog:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={handleLike}
              disabled={loading}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              whileTap={{ scale: 0.9 }}
              className="relative p-1 rounded-full focus:outline-none"
              aria-label={liked ? "Unlike this post" : "Like this post"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={liked ? "liked" : "not-liked"}
                  initial={{ scale: 1 }}
                  animate={{
                    scale: isHovered ? 1.2 : 1,
                    color: liked ? "#dc2626" : "#000000",
                  }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={liked ? "currentColor" : "none"}
                    strokeWidth={2}
                  />
                </motion.div>
              </AnimatePresence>

              {liked && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-100 opacity-0"
                  animate={{ opacity: isHovered ? 0.3 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{liked ? "Unlike this story" : "Like this story"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <motion.div
        key={likes}
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {likes} {likes === 1 ? "like" : "like"}
      </motion.div>
    </div>
  );
};

export default LikeButton;
