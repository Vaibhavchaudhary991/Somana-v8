"use client";
import { useState } from "react";
import UserArticles from "../articleComponents/UserArticles";
import UserPodcasts from "../podcastComponents/UserPodcasts";

export default function UserDataTabs({ userId }) {
  const [activeTab, setActiveTab] = useState("article"); // default

  return (
    <div>
      <div className="flex items-center gap-6 mb-6 mt-8">
        <button
          className={`hover:underline text-sm font-medium cursor-pointer underline-offset-8 decoration-red-600 ${
            activeTab === "article" ? "underline" : ""
          }`}
          onClick={() => setActiveTab("article")}
        >
          Articles
        </button>
        <button
          className={`hover:underline text-sm font-medium cursor-pointer underline-offset-8 decoration-red-600 ${
            activeTab === "podcast" ? "underline" : ""
          }`}
          onClick={() => setActiveTab("podcast")}
        >
          Podcasts
        </button>
      </div>

      <div>
        {activeTab === "article" && (
          <div>
            <UserArticles userId={userId} />
          </div>
        )}

        {activeTab === "podcast" && (
          <div>
            <UserPodcasts authorID={userId} />
          </div>
        )}
      </div>
    </div>
  );
}
