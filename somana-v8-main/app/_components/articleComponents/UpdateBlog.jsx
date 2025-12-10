"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import LoadingMain from "../main/Loading";
// import { Spinner, useToast } from "@chakra-ui/react";
// import AlertBox from "../main/AlertBox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import TiptapEditor from "../editor/TiptapEditor";

const categories = [
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
  "Notes",
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

const UpdateBlog = ({ storyId, supabaseURL, session, hostname }) => {
  // const toast = useToast();
  const [heading, setHeading] = useState("");
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [fileLinks, setFileLinks] = useState("");
  const [genre, setGenre] = useState("Blog");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(`/api/v1/blogs/${storyId}`);
        const data = response?.data?.data;

        setHeading(data.heading);
        setDescription(data.description);
        setFileLinks(data.fileLinks);
        setContent(data.content);
        setTags(data.tags);
        setGenre(data.genre);
        setUserId(data.author._id);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    if (storyId) {
      fetchBlogData();
    }
  }, [storyId]);

  if (!session) {
    return (
      <div className="text-center">
        <p className="font-medium">No Permission to edit this Story</p>
      </div>
    );
  }

  if (session.user.role !== "admin" && session.user.userId !== userId) {
    return (
      <div className="text-center">
        <p className="font-medium">No Permission to edit this Story</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!heading || !description || !tags || !genre) {
      // toast({
      //   description: "Please fill all fields",
      //   status: "error",
      //   duration: 2000,
      //   isClosable: true,
      // });
      return;
    }

    try {
      setIsLoading(true);

      // Prepare blog data for MongoDB
      const blogData = {
        heading,
        description,
        content,
        fileLinks,
        tags,
        genre,
      };

      const response = await axios.patch(`/api/v1/blogs/${storyId}`, blogData, {
        headers: { "Content-Type": "application/json" },
      });

      const slug = response?.data?.data?.updatedBlog?.slug;
      router.push(`/story/${slug}`);

      // Reset form fields
      setHeading("");
      setDescription("");
      setContent("");
      setTags("");
      setFileLinks("");
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Error posting story!",
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      // });
      console.error("Error posting Blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeadingChange = (e) => {
    if (e.target.value.length <= 100) {
      setHeading(e.target.value);
    }
  };

  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= 300) {
      setDescription(e.target.value);
    }
  };

  const handleContentChange = (value) => {
    if (value.length <= 200000) {
      setContent(value);
    }
  };
  const handleTagsChange = (e) => {
    if (e.target.value.length <= 15) {
      setTags(e.target.value);
    }
  };
  const handleFileLinksChange = (e) => {
    setFileLinks(e.target.value);
  };

  const handleGenreChange = (e) => {
    if (e.target.value.length <= 15) {
      setGenre(e.target.value);
    }
  };

  return (
    <div>
      <form className="rounded-md flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2  py-1">
          <Label>Heading</Label>
          <Input
            value={heading}
            onChange={handleHeadingChange}
            placeholder="Write heading"
          />
        </div>
        <div className="flex flex-col gap-2  py-1">
          <Label>Description</Label>
          <Input
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Write description"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 py-1">
          <div className="flex flex-col gap-2">
            <Label>Tags</Label>
            <Input
              value={tags}
              onChange={handleTagsChange}
              placeholder="Write Tags"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Genre</Label>
            <Select value={genre} onValueChange={(value) => setGenre(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                {(session.user.role === "admin" ||
                  session.user.role === "guide") && (
                  <SelectItem value="top-10">Top 10</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>File Links</Label>
          <Input
            value={fileLinks}
            onChange={handleFileLinksChange}
            placeholder="Paste links (Drive, Office and many more)"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Write content</Label>
          <div className="">
            <TiptapEditor content={content} onChange={handleContentChange} />
          </div>
        </div>

        <div className="py-1">
          {isLoading ? <Label>Please do not close this window</Label> : ""}

          <Button disabled={isLoading}>
            {isLoading ? (
              // <Spinner size="sm" />
              <p>Loading</p>
            ) : (
              <div className="flex items-center gap-1">
                <p>Update</p>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;
