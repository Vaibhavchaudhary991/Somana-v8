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
import Link from "next/link";

function MusicPlayer({ audioUrl, image, title, artist, trigger, trackId }) {
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
            <AlertDialogTitle className="text-xl font-bold">
              {title}
            </AlertDialogTitle>
            {artist && (
              <p className="text-sm text-neutral-400 font-medium mt-1">
                {artist}
              </p>
            )}
          </div>
        </AlertDialogHeader>

        <AlertDialogDescription className="mt-4">
          <AudioPlayer
            autoPlay
            src={audioUrl}
            layout="stacked-reverse"
            className="rounded-lg overflow-hidden"
          />
        </AlertDialogDescription>

        <AlertDialogFooter className="mt-4">
          <Link href={`/music/${trackId}`}>
            <Button variant="outline">Open</Button>
          </Link>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default MusicPlayer;
