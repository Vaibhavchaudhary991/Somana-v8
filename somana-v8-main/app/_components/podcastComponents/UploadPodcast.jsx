"use client";
import supabase from "@/app/_lib/supabase";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  Loader2,
  Check,
  Save,
  Send,
  Music,
  Image as ImageIcon,
  X,
  Play,
  Pause,
  Clock,
  FileAudio,
  Tag,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

const UploadPodcast = ({ supabaseURL, session, hostname }) => {
  const [podcastName, setPodcastName] = useState("");
  const [podcastCategory, setPodcastCategory] = useState("Education");
  const [releaseDate, setReleaseDate] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [language, setLanguage] = useState("English");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved");
  const [visibility, setVisibility] = useState("public");
  const [tags, setTags] = useState("");
  const [audioDuration, setAudioDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const audioRef = useRef(null);

  const podcastCategories = [
    "Education", "Technology", "Health", "Lifestyle", "Business",
    "Comedy", "News", "Music", "Sports", "Politics", "Science",
    "History", "Fiction", "Interviews",
  ];
  const podcastLanguages = ["English", "Hindi", "Spanish", "French", "German"];

  // Word count
  const wordCount = useMemo(() => {
    return description.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, [description]);

  // Auto-save simulation
  useEffect(() => {
    if (podcastName || description) {
      setAutoSaveStatus("saving");
      const timer = setTimeout(() => {
        setAutoSaveStatus("saved");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [podcastName, description]);

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle audio file selection
  const handleAudioChange = (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('audio/')) {
      toast.error("Please upload an audio file (MP3, WAV)");
      return;
    }

    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioPreviewUrl(url);

    // Get audio duration
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => {
      setAudioDuration(audio.duration);
    });
  };

  // Handle image file selection
  const handleImageChange = (file) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    setFeaturedImage(file);
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleAudioChange(files[0]);
    }
  };

  // Audio player controls
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!podcastName || !podcastCategory || !audioFile || !featuredImage) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress(10);

      // Upload image
      const imageName = `${Math.random()}-${Date.now()}-${featuredImage.name}`;
      const imagePath = `${supabaseURL}/storage/v1/object/public/podcasts-images/${imageName}`;
      
      setUploadProgress(30);
      await supabase.storage.from("podcasts-images").upload(imageName, featuredImage);

      // Upload audio
      const audioName = `${Math.random()}-${Date.now()}-${audioFile.name}`;
      const audioPath = `${supabaseURL}/storage/v1/object/public/podcasts/${audioName}`;
      
      setUploadProgress(60);
      await supabase.storage.from("podcasts").upload(audioName, audioFile);

      // Create podcast data
      const podcastData = {
        podcastName,
        podcastCategory,
        audioLink: audioPath,
        featuredImage: imagePath,
        language,
        description,
        author: session.user.userId,
      };

      setUploadProgress(90);
      await axios.post(`/api/v1/podcasts`, podcastData, {
        headers: { "Content-Type": "application/json" },
      });

      setUploadProgress(100);
      toast.success("Podcast published successfully!");

      // Reset form
      setPodcastName("");
      setPodcastCategory("Education");
      setAudioFile(null);
      setAudioPreviewUrl("");
      setFeaturedImage(null);
      setImagePreviewUrl("");
      setLanguage("English");
      setDescription("");
      setTags("");
    } catch (error) {
      toast.error("Error uploading podcast!");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <FileAudio className="w-4 h-4" />
                  <span>Podcast Episode</span>
                </div>
                {audioDuration > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(audioDuration)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {autoSaveStatus === "saving" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
                    <span className="text-purple-600 dark:text-purple-400">Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400">Saved</span>
                  </>
                )}
              </div>
            </div>

            {/* Podcast Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <input
                type="text"
                value={podcastName}
                onChange={(e) => setPodcastName(e.target.value)}
                placeholder="Podcast episode title..."
                className="w-full text-3xl md:text-4xl font-bold bg-transparent border-none outline-none focus:ring-0 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-gray-100 px-0"
                maxLength={100}
              />
              <div className="text-xs text-gray-500 mt-1">
                {podcastName.length}/100 characters
              </div>
            </motion.div>

            {/* Audio Upload Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-8"
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!audioFile ? (
                <div className={`text-center transition-colors ${isDragging ? 'border-purple-500' : ''}`}>
                  <Music className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Upload your podcast audio
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mb-4">
                    Supported formats: MP3, WAV • Max size: 500MB
                  </p>
                  <label className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer transition-colors border border-gray-200 dark:border-gray-700">
                    <Upload className="w-4 h-4" />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleAudioChange(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-500/10 rounded-lg">
                        <FileAudio className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{audioFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                          {audioDuration > 0 && ` • ${formatDuration(audioDuration)}`}
                        </p>
                      </div>
                    </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAudioFile(null);
                          setAudioPreviewUrl("");
                          setAudioDuration(0);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </button>
                  </div>

                  {/* Audio Preview Player */}
                  {audioPreviewUrl && (
                    <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                      <audio ref={audioRef} src={audioPreviewUrl} className="hidden" />
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={togglePlayPause}
                          className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 text-white" />
                          ) : (
                            <Play className="w-5 h-5 text-white" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-600 w-0" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {isLoading && uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Uploading...</span>
                        <span className="text-purple-600 dark:text-purple-400">{uploadProgress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                          className="h-full bg-gradient-to-r from-purple-600 to-violet-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
            >
              <Label className="text-gray-700 dark:text-gray-300 mb-2 font-medium">Episode Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your podcast episode..."
                rows={6}
                className="resize-none bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:border-purple-500 focus:ring-purple-500"
              />
              <div className="text-xs text-gray-500 mt-2">
                {wordCount} words
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
            >
              <Label className="text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 font-medium">
                <Tag className="w-4 h-4" />
                Tags
              </Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., technology, startup, business"
                className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:border-purple-500 focus:ring-purple-500"
              />
            </motion.div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="sticky top-8 space-y-6"
            >
              {/* Publish Settings Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl hover:shadow-2xl transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Publish Settings
                </h3>

                <div className="space-y-4">
                  {/* Featured Image */}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">Cover Image *</Label>
                    {imagePreviewUrl ? (
                      <div className="relative group">
                        <img
                          src={imagePreviewUrl}
                          alt="Cover"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFeaturedImage(null);
                            setImagePreviewUrl("");
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition-colors bg-gray-50 dark:bg-gray-950">
                        <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-700 mb-2" />
                        <span className="text-sm text-gray-500 dark:text-gray-600">Upload cover</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e.target.files[0])}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">Category *</Label>
                    <Select value={podcastCategory} onValueChange={setPodcastCategory}>
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {podcastCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language */}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">Language *</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {podcastLanguages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Visibility */}
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300 text-sm mb-2 flex items-center gap-2 font-medium">
                      {visibility === "public" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      Visibility
                    </Label>
                    <Select value={visibility} onValueChange={setVisibility}>
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Schedule Date (if scheduled) */}
                  {visibility === "scheduled" && (
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300 text-sm mb-2 flex items-center gap-2 font-medium">
                        <Calendar className="w-4 h-4" />
                        Publish Date
                      </Label>
                      <Input
                        type="datetime-local"
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Publish Episode
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadPodcast;
