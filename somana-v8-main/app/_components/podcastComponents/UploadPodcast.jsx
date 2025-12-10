"use client";
import supabase from "@/app/_lib/supabase";
import React, { useState } from "react";
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
import { LucideClockFading, Upload } from "lucide-react";
// import { UploadIcon } from "lucide-react";
// import { ReloadIcon } from "@radix-ui/react-icons";

const UploadPodcast = ({ supabaseURL, session, hostname }) => {
  const [podcastName, setPodcastName] = useState("");
  const [podcastCategory, setPodcastCategory] = useState("Education");
  const [releaseDate, setReleaseDate] = useState("");
  const [audioLink, setAudioLink] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");

  const [language, setLanguage] = useState("English");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const podcastCategories = [
    "Education",
    "Technology",
    "Health",
    "Lifestyle",
    "Business",
    "Comedy",
    "News",
    "Music",
    "Sports",
    "Politics",
    "Science",
    "History",
    "Fiction",
    "Interviews",
  ];
  const podcastLanguages = ["English", "Hindi", "Spanish", "French", "German"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!podcastName || !podcastCategory || !audioLink || !featuredImage) {
      toast("Field Error", {
        description: "Please fill all input fields",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });

      return;
    }

    if (!audioLink || audioLink.type.split("/")[0] !== "audio") {
      toast("Type Error", {
        description: "Only Audio file is allowed",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    if (!featuredImage || featuredImage.type.split("/")[0] !== "image") {
      toast("Type Error", {
        description: "Only Image file is allowed",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    try {
      toast("Uploading Progress", {
        description: "Uploading data in progress",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      setIsLoading(true);
      const imageName = `${Math.random()}-${Date.now()}-${featuredImage?.name}`;
      const imagePath = `${supabaseURL}/storage/v1/object/public/podcasts-images/${imageName}`;
      const audioName = `${Math.random()}-${Date.now()}-${audioLink?.name}`;
      const audioPath = `${supabaseURL}/storage/v1/object/public/podcasts/${audioName}`;

      const podcastData = {
        podcastName: podcastName,
        podcastCategory: podcastCategory,
        audioLink: audioPath,
        featuredImage: imagePath,
        language: language,
        description: description,
        author: session.user.userId,
      };

      toast("Uploading Progress", {
        description: "Uploading Podcast Image",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      const podcastImage = featuredImage;
      await supabase.storage
        .from("podcasts-images")
        .upload(imageName, podcastImage);

      toast("Uploading Progress", {
        description: "Uploading Podcast Audio",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      const podcastAudio = audioLink;
      await supabase.storage.from("podcasts").upload(audioName, podcastAudio);

      toast("Uploading Progress", {
        description: "Uploading Podcast Data",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      const response = await axios.post(`/api/v1/podcasts`, podcastData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(podcastData);

      toast("Uploaded Successfully", {
        description: "Podcast data uploaded successfully",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      setPodcastName("");
      setPodcastCategory("");
      setAudioLink("");
      setFeaturedImage("");
      setReleaseDate("");

      setLanguage("");
      setDescription("");
    } catch (error) {
      toast("Error Uploading!", {
        description: "Podcast data not uploaded!",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      console.log("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-4 overflow-hidden"
      >
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <Label>Podcast name :</Label>
            <Input
              value={podcastName}
              onChange={(e) => setPodcastName(e.target.value)}
              placeholder="Podcast Name"
              className="w-96"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Category:</Label>
            <Select
              value={podcastCategory}
              onValueChange={(value) => setPodcastCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {podcastCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-2">
              <Label>Language:</Label>
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
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
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-start gap-2">
            <Label>Podcast Audio:</Label>
            <Input
              onChange={(e) => setAudioLink(e.target.files[0])}
              type="file"
              id="podcast-audio"
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label>Featured Image:</Label>
            <Input
              onChange={(e) => setFeaturedImage(e.target.files[0])}
              type="file"
              id="podcasts-image"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col w-full gap-2">
            <Label>Description:</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Write podcast description"
              className="resize-none"
            />
          </div>
        </div>

        <Button className="w-fit" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center gap-1">
              <p>Uploading</p>
              <LucideClockFading
                className="size-4 animate-spin"
                weight="bold"
              />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <p>Upload</p>
              <Upload className="size-4" weight="bold" />
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default UploadPodcast;
