"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GlobalLoader = () => {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-4 border-neutral-800 rounded-full animate-spin border-t-transparent" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
