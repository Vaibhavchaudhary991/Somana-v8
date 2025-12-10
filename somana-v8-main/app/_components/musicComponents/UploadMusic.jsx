"use client";
import supabase from "@/app/_lib/supabase";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { CalendarIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const UploadMusic = ({ supabaseURL, session, hostname }) => {
  const [musicName, setMusicName] = useState("");
  const [musicType, setMusicType] = useState("Love");
  const [releaseDate, setReleaseDate] = useState("");
  const [audioLink, setAudioLink] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [credits, setCredits] = useState("");
  const [album, setAlbum] = useState("");
  const [songLang, setSongLang] = useState("Hindi");
  const [lyrics, setLyrics] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const musicCategories = [
    "Love",
    "Pop",
    "Happy",
    "Break-up",
    "Sad",
    "Funk",
    "Relaxed",
    "Nostalgic",
    "Motivational",
    "Rock",
    "Hip-Hop",
    "Rap",
    "Classical",
    "Jazz",
    "Country",
    "Electronic",
    "Indie",
    "Workout",
    "Study",
    "Sleep",
    "Party",
    "Road Trip",
    "Romance",
    "Nature",
    "Social-Issues",
    "Fantasy",
    "Sci-Fi",
    "Travel",
    "Gaming",
  ];
  const songLanguages = ["Hindi", "English", "Spanish", "Turkish", "Nepali"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !musicName ||
      !musicType ||
      !releaseDate ||
      !audioLink ||
      !featuredImage ||
      !credits ||
      !album
    ) {
      toast("Field Error", {
        description: "Please fill all input fields",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    if (audioLink.type.split("/")[0] !== "audio") {
      toast("Field Error", {
        description: "Please fill all input fields",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    if (featuredImage.type.split("/")[0] !== "image") {
      toast("Field Error", {
        description: "Please fill all input fields",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    try {
      toast("Field Error", {
        description: "Please fill all input fields",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      setIsLoading(true);
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
        credits: credits,
        album: album,
        songLang: songLang,
        lyrics: lyrics,
        author: session.user.userId,
      };
      console.log(musicData);

      toast("Field Error", {
        description: "Please fill all input fields",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      const avatarImage = featuredImage;
      await supabase.storage
        .from("audio-track-images")
        .upload(imageName, avatarImage);

      toast("Field Error", {
        description: "Please fill all input fields",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      const avatarAudio = audioLink;
      await supabase.storage
        .from("audio-tracks")
        .upload(audioName, avatarAudio);

      toast("Field Error", {
        description: "Please fill all input fields",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      const response = await axios.post(`/api/v1/music`, musicData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast("Field Error", {
        description: "Please fill all input fields",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      // const slug = response?.data?.data?.newBlog?.slug;
      // toast.success("Music Uploaded Success!");
      // router.push(`/music`);
      // console.log(response);

      setMusicName("");
      setMusicType("");
      setAudioLink("");
      setFeaturedImage("");
      setReleaseDate("");
      setLyrics("");
      setCredits("");
      setAlbum("");
    } catch (error) {
      toast("Field Error", {
        description: "Please fill all input fields",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      console.log("Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <Label>Music name : </Label>
            <Input
              value={musicName}
              onChange={(e) => setMusicName(e.target.value)}
              placeholder="Song name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Type : </Label>
            <Select
              value={musicType}
              onValueChange={(value) => setMusicType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {musicCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Relase Date : </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !releaseDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {releaseDate ? (
                    format(releaseDate, "PPP")
                  ) : (
                    <span>Pick a Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={releaseDate}
                  onSelect={setReleaseDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-2">
            <Label>Artists : </Label>
            <Input
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              placeholder="Credits / Artist names"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Album : </Label>
            <Input
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              placeholder="Album name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Language : </Label>
            <div>
              <Select
                value={songLang}
                onValueChange={(value) => setSongLang(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {songLanguages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-start gap-2">
            <Label>Music file : </Label>
            <Input
              onChange={(e) => setAudioLink(e.target.files[0])}
              type="file"
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label>Featured Image : </Label>
            <Input
              onChange={(e) => setFeaturedImage(e.target.files[0])}
              type="file"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col w-full gap-2">
            <Label>Lyrics (optional) : </Label>
            <Textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              rows={10}
              className="resize-none"
            />
          </div>
        </div>
        {isLoading ? (
          <p className="flex text-sm my-2 items-center gap-1 text-yellow-600">
            <Info /> Please do not close window while posting
          </p>
        ) : (
          ""
        )}

        <Button disabled={isLoading} className="w-fit">
          {isLoading ? (
            <p>Loading</p>
          ) : (
            <div className="flex items-center gap-1">
              <p>Upload</p>
              {/* <Upload className="size-4" weight="bold" /> */}
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};

export default UploadMusic;
