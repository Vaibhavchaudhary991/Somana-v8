"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TopCreatorsList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/v1/users/top-creators")
      .then((res) => {
        setUsers(res.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full mx-auto shadow-none">
      <div className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-300" />
                  <div>
                    <div className="h-3 w-28 bg-gray-300 rounded mb-1" />
                    <div className="h-2 w-20 bg-gray-300 rounded" />
                  </div>
                </div>
                <div className="h-4 w-10 bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        ) : (
          users.map((user, index) => (
            <div
              key={user._id}
              className="flex items-center justify-between border p-2 rounded-xl hover:bg-accent transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-muted-foreground w-5">
                  #{index + 1}
                </span>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.photo} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  {/* <p className="font-medium">{user.name}</p> */}
                  <p className="text-xs text-muted-foreground">
                    @{user.userName}
                  </p>
                </div>
              </div>
              <div className="text-right flex gap-1">
                {user.badge && <Badge variant="outline">{user.badge}</Badge>}
                {user.xp !== undefined && (
                  <Badge variant="outline">XP: {user.xp}</Badge>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
