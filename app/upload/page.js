"use client";

import Link from "next/link";
import { 
  PenSquare, 
  Mic, 
  Music, 
  TrendingUp, 
  Users, 
  FileText,
  Play,
  Award,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchDashboardStats = async () => {
  const res = await axios.get("/api/dashboard-stats");
  return res.data.data;
};

export default function CreatorStudio() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });

  const stats = [
    { 
      label: "Total Stories", 
      value: isLoading ? "..." : (statsData?.totalStories?.formatted || "0"), 
      icon: FileText, 
      color: "blue" 
    },
    { 
      label: "Total Plays", 
      value: isLoading ? "..." : (statsData?.totalPlays?.formatted || "0"), 
      icon: Play, 
      color: "purple" 
    },
    { 
      label: "Followers", 
      value: isLoading ? "..." : (statsData?.followers?.formatted || "0"), 
      icon: Users, 
      color: "green" 
    },
    { 
      label: "Creator Level", 
      value: isLoading ? "..." : (statsData?.creatorLevel || "Free"), 
      icon: Award, 
      color: "yellow" 
    },
  ];

  const creatorCards = [
    {
      title: "Write Story",
      description: "Share your thoughts and ideas with the world through compelling articles",
      icon: PenSquare,
      href: "/story/write",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      darkBgGradient: "dark:from-blue-950 dark:to-cyan-950",
    },
    {
      title: "Upload Podcast",
      description: "Broadcast your voice and connect with listeners through audio content",
      icon: Mic,
      href: "/podcast/upload",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      darkBgGradient: "dark:from-purple-950 dark:to-pink-950",
    },
    {
      title: "Upload Music",
      description: "Share your musical creations and reach music lovers worldwide",
      icon: Music,
      href: "/music/upload",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      darkBgGradient: "dark:from-green-950 dark:to-emerald-950",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
      purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
      green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
      yellow: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Creator Studio
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent mb-4">
            Create & Publish
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your creative hub for stories, podcasts, and music. Start creating content that inspires and engages your audience.
          </p>
        </motion.div>

        {/* Creator Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getColorClasses(stat.color)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Creator Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            What would you like to create today?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {creatorCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Link href={card.href}>
                    <div className={`relative overflow-hidden bg-gradient-to-br ${card.bgGradient} ${card.darkBgGradient} rounded-3xl p-8 h-full border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300`}>
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      
                      {/* Icon */}
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${card.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        {card.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {card.description}
                      </p>

                      {/* CTA Button */}
                      <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${card.gradient} text-white rounded-xl font-medium shadow-md group-hover:shadow-xl transition-all duration-300`}>
                        <span>Get Started</span>
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Your Drafts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Your Drafts
            </h2>
            <Link
              href="/me"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center">
            <div className="inline-flex p-4 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No drafts yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Start creating content and your drafts will appear here
            </p>
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl p-8 border border-blue-100 dark:border-blue-900"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            💡 Creator Tips
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Publish consistently to grow your audience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>Engage with your followers through comments</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Use high-quality images and audio for better engagement</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
