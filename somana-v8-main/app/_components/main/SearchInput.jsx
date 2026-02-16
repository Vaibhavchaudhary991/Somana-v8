"use client"; // If using the app directory in Next.js 13+

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation"; // Use `next/navigation` for client-side navigation in the app directory
import { useState } from "react";

export default function SearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="hidden sm:block ">
      <form onSubmit={handleSearch} className="flex items-center gap-1">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="w-64 outline-none"
        />
        <Button variant="outline" className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:border-blue-300 transform" size="icon">
          <Search weight="bold" />
        </Button>
      </form>
    </div>
  );
}
