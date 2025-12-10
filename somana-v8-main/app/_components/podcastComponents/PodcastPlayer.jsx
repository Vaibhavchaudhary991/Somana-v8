"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Button } from "@/components/ui/button";

function PodcastPlayer({ audioUrl, image, title, trigger, description }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="bg-gradient-to-br bg-white border-none">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="rounded-lg overflow-hidden mx-auto w-full">
            <img
              className="h-60 w-full object-cover rounded-md shadow-lg"
              src={image}
              alt={title}
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-1 line-clamp-1">{title}</p>
            <p className="text-xs">{description}</p>
          </div>
          <AlertDialogDescription className="mt-4">
            <AudioPlayer
              autoPlay
              src={audioUrl}
              layout="stacked-reverse"
              className="rounded-lg overflow-hidden"
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PodcastPlayer;
