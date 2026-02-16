"use client";
import React, { useState, useEffect, useMemo } from "react";
import supabase from "@/app/_lib/supabase";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  SendIcon, 
  Sparkles, 
  Image as ImageIcon,
  FileText,
  Clock,
  Save,
  Check,
  Loader2,
  X
} from "lucide-react";
import TiptapEditor from "../editor/TiptapEditor";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  "Blog", "Automotive", "Beauty", "Books", "Business", "Career",
  "Cryptocurrency", "Culture", "Crafts", "Design", "Education",
  "Entertainment", "Environmental", "Fashion", "Finance", "Fitness",
  "Food", "Gaming", "Gardening", "Health", "History", "Home",
  "Humor", "Interests", "Investing", "Legal", "Lifestyle", "Luxury",
  "Marketing", "Movies", "Music", "News", "Nonprofit", "Notes",
  "Parenting", "Pets", "Photography", "Politics", "Estate",
  "Relationships", "Science", "Shopping", "Social", "Space",
  "Spirituality", "Sports", "Startups", "Story", "Technology",
  "Tips", "Travel", "Volunteer", "Writing",
];

const WriteBlog = ({ supabaseURL, session, hostname }) => {
  const router = useRouter();
  
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [collectedImages, setCollectedImages] = useState([]);
  const [tags, setTags] = useState("");
  const [fileInputs, setFileInputs] = useState([0]);
  const [fileLinks, setFileLinks] = useState("");
  const [genre, setGenre] = useState("Blog");
  const [featuredImage, setFeaturedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [question, setQuestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState("quick"); // "quick" or "professional"
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved");

  // Word count and reading time
  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, '');
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, [content]);

  const readingTime = useMemo(() => {
    return Math.ceil(wordCount / 200);
  }, [wordCount]);

  // Auto-save simulation
  useEffect(() => {
    if (heading || description || content) {
      setAutoSaveStatus("saving");
      const timer = setTimeout(() => {
        setAutoSaveStatus("saved");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [heading, description, content]);

  const handleUseAI = () => setUseAI(true);
  const handleNotUseAI = () => setUseAI(false);

  const handleGenerateWithAI = async () => {
    if (!question) {
      toast.error("Please enter a topic or question");
      return;
    }
    setAiLoading(true);
    try {
      if (aiMode === "professional") {
        // Use professional content writer
        const response = await axios.post("/api/v1/ai/generate-article", { topic: question });
        if (response.data.statusText === "success") {
          const { title, description, category, tags, content } = response.data.data;
          setHeading(title);
          setDescription(description);
          setContent(content);
          setGenre(category);
          setTags(tags.join(", "));
          toast.success("Professional article generated successfully!");
        }
      } else {
        // Use quick generate (existing functionality)
        const response = await axios.post("/api/v1/ai/ask", { question });
        if (response.data.statusText === "success") {
          setContent(response.data.answer);
          toast.success("Content generated successfully!");
        }
      }
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error(error.response?.data?.message || "Failed to generate content");
    } finally {
      setAiLoading(false);
    }
  };

  const handleFeaturedImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    try {
      const fileName = `${Math.random()}-${Date.now()}-${file.name}`;
      console.log("Attempting upload:", fileName, "Size:", file.size, "Type:", file.type);
      
      const { data, error: uploadError } = await supabase.storage
        .from("story-images")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Supabase upload error details:", {
          message: uploadError.message,
          statusCode: uploadError.statusCode,
          error: uploadError.error,
          name: uploadError.name,
          fullError: JSON.stringify(uploadError)
        });
        
        // Provide helpful error messages
        if (uploadError.message?.includes('not found') || uploadError.statusCode === 404) {
          toast.error("Storage bucket 'story-images' does not exist. Please create it in Supabase Dashboard.");
        } else if (uploadError.message?.includes('permission') || uploadError.statusCode === 403) {
          toast.error("Permission denied. Check bucket policies in Supabase.");
        } else {
          toast.error(`Upload failed: ${uploadError.message || uploadError.error || 'Unknown error'}`);
        }
        return;
      }

      console.log("Upload successful:", data);
      const imageUrl = `${supabaseURL}/storage/v1/object/public/story-images/${fileName}`;
      setFeaturedImage(imageUrl);
      toast.success("Featured image uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload image: ${error.message || 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!heading || !description || !content || !featuredImage) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const uploadedImageUrls = [];
      for (const image of collectedImages) {
        if (image) {
          const fileName = `${Math.random()}-${Date.now()}-${image.name}`;
          const { error } = await supabase.storage
            .from("story-images")
            .upload(fileName, image);
          if (!error) {
            uploadedImageUrls.push(
              `${supabaseURL}/storage/v1/object/public/story-images/${fileName}`
            );
          } else {
            console.error("Image upload error:", error);
          }
        }
      }

      const response = await axios.post("/api/v1/blogs", {
        heading: heading.trim(),
        description: description.trim(),
        content,
        featuredImage,
        tags: tags || "", // Ensure tags is a string, not undefined
        genre: genre || "Blog", // Ensure genre has a default value
        fileLinks: fileLinks || "", // Ensure fileLinks is a string, not undefined
        collectedImages: uploadedImageUrls, // Use correct field name
        author: session.user.userId,
      });

      if (response.data.statusText === "success") {
        toast.success("Story published successfully!");
        router.push(`/story/${response.data.data.newBlog.slug}`);
      } else {
        toast.error(response.data.message || "Failed to publish story");
      }
    } catch (error) {
      console.error("Error posting story:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          "Error posting story!";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeadingChange = (e) => {
    if (e.target.value.length <= 100) setHeading(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= 300) setDescription(e.target.value);
  };

  const handleContentChange = (value) => {
    if (value.length <= 200000) setContent(value);
  };

  const handleTagsChange = (e) => {
    if (e.target.value.length <= 60) setTags(e.target.value);
  };

  const handleFileLinksChange = (e) => setFileLinks(e.target.value);

  const handleImageChange = (e, index) => {
    const files = Array.from(e.target.files);
    setCollectedImages((prev) => {
      const updated = [...prev];
      updated[index] = files[0];
      return updated;
    });
  };

  const addFileInput = () => {
    setFileInputs((prev) => [...prev, prev.length]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* AI Assistant Panel */}
      <AnimatePresence>
        {useAI && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 border-l border-gray-200 dark:border-gray-800"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    AI Assistant
                  </h3>
                </div>
                <button
                  onClick={handleNotUseAI}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                {/* Mode Selector */}
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setAiMode("quick")}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      aiMode === "quick"
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    Quick Generate
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiMode("professional")}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      aiMode === "professional"
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    Professional Writer
                  </button>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {aiMode === "professional" 
                      ? "Enter your topic or prompt:" 
                      : "What would you like to write about?"}
                  </Label>
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={
                      aiMode === "professional"
                        ? "E.g., The future of artificial intelligence in healthcare..."
                        : "E.g., Write an article about sustainable living..."
                    }
                    rows={4}
                    className="resize-none"
                  />
                  {aiMode === "professional" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      ✨ Will generate: Title, Description, Full Article (800-1200 words), Category, and 5 SEO Tags
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleGenerateWithAI}
                  disabled={aiLoading || !question}
                  className={`w-full ${
                    aiMode === "professional"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  }`}
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {aiMode === "professional" ? "Generating Article..." : "Generating..."}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {aiMode === "professional" ? "Generate Full Article" : "Generate Content"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>{wordCount} words</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {autoSaveStatus === "saving" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-blue-500">Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Saved</span>
                  </>
                )}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <input
                type="text"
                value={heading}
                onChange={handleHeadingChange}
                placeholder="Story title..."
                className="w-full text-4xl md:text-5xl font-bold bg-transparent border-none outline-none focus:ring-0 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-gray-100 px-0"
                maxLength={100}
              />
              <div className="text-xs text-gray-400 mt-1">
                {heading.length}/100 characters
              </div>
            </div>

            {/* Description */}
            <div>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Write a compelling description..."
                rows={3}
                className="w-full text-lg bg-transparent border-none outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-600 text-gray-700 dark:text-gray-300 resize-none px-0"
                maxLength={300}
              />
              <div className="text-xs text-gray-400 mt-1">
                {description.length}/300 characters
              </div>
            </div>

            {/* Editor */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <TiptapEditor content={content} onChange={handleContentChange} />
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Publish Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Publish Settings
                </h3>

                <div className="space-y-4">
                  {/* Featured Image */}
                  <div>
                    <Label className="text-sm mb-2">Featured Image *</Label>
                    {featuredImage ? (
                      <div className="relative group">
                        <img
                          src={featuredImage}
                          alt="Featured"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFeaturedImage("")}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Upload image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFeaturedImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Genre */}
                  <div>
                    <Label className="text-sm mb-2">Category *</Label>
                    <Select value={genre} onValueChange={setGenre}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                        {(session.user.role === "admin" || session.user.role === "guide") && (
                          <SelectItem value="top-10">Top 10</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags */}
                  <div>
                    <Label className="text-sm mb-2">Tags</Label>
                    <Input
                      value={tags}
                      onChange={handleTagsChange}
                      placeholder="e.g., technology, innovation"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Separate multiple tags with commas
                    </p>
                  </div>

                  {/* File Links */}
                  <div>
                    <Label className="text-sm mb-2">File Links</Label>
                    <Input
                      value={fileLinks}
                      onChange={handleFileLinksChange}
                      placeholder="Drive, Office links..."
                    />
                  </div>

                  {/* Additional Images */}
                  <div>
                    <Label className="text-sm mb-2">Additional Images</Label>
                    <div className="space-y-2">
                      {fileInputs.map((input, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, index)}
                            className="text-sm"
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addFileInput}
                        className="w-full"
                      >
                        Add More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Button */}
              {!useAI && (
                <Button
                  type="button"
                  onClick={handleUseAI}
                  variant="outline"
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Use AI Assistant
                </Button>
              )}

              {/* Publish Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <SendIcon className="w-4 h-4 mr-2" />
                    Publish Story
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WriteBlog;
