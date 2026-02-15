"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true, // IMPORTANT: sends cookies
});

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await API.get("/api/v1/users/me");
      setUser(res.data.data);
    } catch (err) {
      // If unauthorized, just set user null (don’t crash app)
      if (err.response?.status === 401) {
        setUser(null);
      } else {
        console.error("Failed to fetch user:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refetch: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);


