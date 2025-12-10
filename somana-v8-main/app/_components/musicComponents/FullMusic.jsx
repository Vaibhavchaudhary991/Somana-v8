"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AudioPlayer from "react-h5-audio-player";
import RelatedList from "./RelatedList";

const FullMusic = ({ id }) => {
  const [track, setTrack] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const res = await axios.get(`/api/v1/music/${id}`);
        setTrack(res.data.data);
      } catch (err) {
        console.error("Music fetch error:", err);
        setError("Music not found or failed to load.");
      }
    };

    if (id) {
      fetchMusic();
    }
  }, [id]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  const {
    _id: trackId,
    musicName: title,
    audioLink: audioUrl,
    featuredImage: image,
    author: { name: artist } = {},
  } = track;

  return (
    <div className="bg-gradient-to-br bg-white rounded-lg p-6 w-full">
      <div className="text-center space-y-4">
        <div className="rounded-lg overflow-hidden mx-auto w-full">
          <img
            className="h-60 w-full object-cover rounded-md shadow-lg"
            src={image}
            alt={title}
          />
        </div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {artist && (
            <p className="text-sm text-neutral-400 font-medium mt-1">
              {artist}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <AudioPlayer
          autoPlay
          src={audioUrl}
          layout="stacked-reverse"
          className="rounded-lg overflow-hidden"
        />
      </div>
      <div className="mt-8">
        <RelatedList genre={track?.musicType} />
      </div>
    </div>
  );
};

export default FullMusic;
