"use client";
import supabase from "@/app/_lib/supabase";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, Info, Upload, Music, Image as ImageIcon, X } from "lucide-react";
import "./upload-music.css";

const PremiumMusicUpload = ({ supabaseURL, session, hostname }) => {
  const [musicName, setMusicName] = useState("");
  const [musicType, setMusicType] = useState("Love");
  const [releaseDate, setReleaseDate] = useState(null);
  const [audioLink, setAudioLink] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [credits, setCredits] = useState("");
  const [artists, setArtists] = useState([]);
  const [artistInput, setArtistInput] = useState("");
  const [album, setAlbum] = useState("");
  const [songLang, setSongLang] = useState("Hindi");
  const [lyrics, setLyrics] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioFileName, setAudioFileName] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const musicCategories = [
    "Love", "Pop", "Happy", "Break-up", "Sad", "Funk", "Relaxed",
    "Nostalgic", "Motivational", "Rock", "Hip-Hop", "Rap", "Classical",
    "Jazz", "Country", "Electronic", "Indie", "Workout", "Study",
    "Sleep", "Party", "Road Trip", "Romance", "Nature", "Social-Issues",
    "Fantasy", "Sci-Fi", "Travel", "Gaming",
  ];

  const songLanguages = ["Hindi", "English", "Spanish", "Turkish", "Nepali"];

  const handleArtistKeyDown = (e) => {
    if (e.key === "Enter" && artistInput.trim()) {
      e.preventDefault();
      if (!artists.includes(artistInput.trim())) {
        setArtists([...artists, artistInput.trim()]);
      }
      setArtistInput("");
    }
  };

  const removeArtist = (artistToRemove) => {
    setArtists(artists.filter((artist) => artist !== artistToRemove));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioLink(file);
      setAudioFileName(file.name);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
      setImageFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !musicName ||
      !musicType ||
      !releaseDate ||
      !audioLink ||
      !featuredImage ||
      artists.length === 0 ||
      !album
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (audioLink.type.split("/")[0] !== "audio") {
      toast.error("Please upload a valid audio file");
      return;
    }

    if (featuredImage.type.split("/")[0] !== "image") {
      toast.error("Please upload a valid image file");
      return;
    }

    try {
      setIsLoading(true);
      toast.info("Uploading your track...");

      const imageName = `${Math.random()}-${Date.now()}-${featuredImage?.name}`;
      const imagePath = `${supabaseURL}/storage/v1/object/public/audio-track-images/${imageName}`;
      const audioName = `${Math.random()}-${Date.now()}-${audioLink?.name}`;
      const audioPath = `${supabaseURL}/storage/v1/object/public/audio-tracks/${audioName}`;

      const musicData = {
        musicName: musicName,
        musicType: musicType,
        releaseDate: releaseDate,
        audioLink: audioPath,
        featuredImage: imagePath,
        credits: artists.join(", "),
        album: album,
        songLang: songLang,
        lyrics: lyrics,
        author: session.user.userId,
      };

      await supabase.storage
        .from("audio-track-images")
        .upload(imageName, featuredImage);

      await supabase.storage
        .from("audio-tracks")
        .upload(audioName, audioLink);

      const response = await axios.post(`/api/v1/music`, musicData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Music uploaded successfully! 🎵");

      // Reset form
      setMusicName("");
      setMusicType("Love");
      setAudioLink(null);
      setFeaturedImage(null);
      setReleaseDate(null);
      setLyrics("");
      setCredits("");
      setArtists([]);
      setAlbum("");
      setAudioFileName("");
      setImageFileName("");
    } catch (error) {
      toast.error("Failed to upload music. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Main Upload Container */}
      <div className="upload-container">
        <div className="upload-card">
          <div className="card-header">
            <h1 className="card-title">Upload New Track</h1>
            <p className="card-subtitle">Share your sound with the world</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* First Row: Music Name, Type, Release Date */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Music Name</label>
                <input
                  type="text"
                  className="premium-input"
                  placeholder="Enter track name"
                  value={musicName}
                  onChange={(e) => setMusicName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="premium-select"
                  value={musicType}
                  onChange={(e) => setMusicType(e.target.value)}
                >
                  {musicCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Release Date</label>
                <input
                  type="date"
                  className="premium-input"
                  value={releaseDate ? format(releaseDate, "yyyy-MM-dd") : ""}
                  onChange={(e) => setReleaseDate(new Date(e.target.value))}
                />
              </div>
            </div>

            {/* Second Row: Artists, Album, Language */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Artists</label>
                <div className="tag-input-container">
                  {artists.map((artist, index) => (
                    <div key={index} className="tag-chip">
                      {artist}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => removeArtist(artist)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    className="tag-input"
                    placeholder="Type artist name and press Enter"
                    value={artistInput}
                    onChange={(e) => setArtistInput(e.target.value)}
                    onKeyDown={handleArtistKeyDown}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Album</label>
                <input
                  type="text"
                  className="premium-input"
                  placeholder="Enter album name"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Language</label>
                <select
                  className="premium-select"
                  value={songLang}
                  onChange={(e) => setSongLang(e.target.value)}
                >
                  {songLanguages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* File Uploads */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Music File</label>
                <div className="file-upload-area">
                  <div className="file-upload-icon">
                    <Music size={48} color="#94a3b8" />
                  </div>
                  <p className="file-upload-text">
                    Drop your audio file here or browse
                  </p>
                  <p className="file-upload-subtext">MP3, WAV, FLAC supported</p>
                  <input
                    type="file"
                    className="file-upload-input"
                    accept="audio/*"
                    onChange={handleAudioChange}
                  />
                  {audioFileName && (
                    <div className="file-name-display">🎵 {audioFileName}</div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Featured Image</label>
                <div className="file-upload-area">
                  <div className="file-upload-icon">
                    <ImageIcon size={48} color="#94a3b8" />
                  </div>
                  <p className="file-upload-text">
                    Drop your image here or browse
                  </p>
                  <p className="file-upload-subtext">JPG, PNG, WebP supported</p>
                  <input
                    type="file"
                    className="file-upload-input"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imageFileName && (
                    <div className="file-name-display">🖼️ {imageFileName}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Lyrics */}
            <div className="form-grid">
              <div className="form-group form-grid-full">
                <label className="form-label">Lyrics (Optional)</label>
                <textarea
                  className="premium-textarea"
                  placeholder="Enter song lyrics..."
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  rows={8}
                />
              </div>
            </div>

            {/* Loading Warning */}
            {isLoading && (
              <p className="flex text-sm my-2 items-center gap-1 text-yellow-400">
                <Info size={16} /> Please do not close window while uploading
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} style={{ display: "inline", marginRight: "8px" }} />
                  Upload Track
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PremiumMusicUpload;
