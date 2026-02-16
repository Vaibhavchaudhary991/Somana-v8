"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return (
      <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full" />
    );
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      style={{
        backgroundColor: isDark ? "#3b82f6" : "#e5e7eb",
      }}
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Toggle circle */}
      <span
        className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isDark ? "translate-x-8" : "translate-x-1"
        }`}
      >
        {/* Icon inside the toggle */}
        {isDark ? (
          <Moon className="h-3 w-3 text-blue-600" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-500" />
        )}
      </span>

      {/* Background icons (optional decorative) */}
      <span
        className={`absolute left-1.5 transition-opacity duration-300 ${
          isDark ? "opacity-0" : "opacity-100"
        }`}
      >
        <Sun className="h-3 w-3 text-yellow-600" />
      </span>
      <span
        className={`absolute right-1.5 transition-opacity duration-300 ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      >
        <Moon className="h-3 w-3 text-white" />
      </span>
    </button>
  );
}
