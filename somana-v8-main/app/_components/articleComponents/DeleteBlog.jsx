"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
const DeleteButton = ({ blogId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // const toast = useToast();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/v1/blogs/${blogId}`);
      if (response.status === 200) {
        router.push("/");
        // toast({
        //   title: "Story deleted!",
        //   description: "Story added successfully",
        //   status: "success",
        //   duration: 3000,
        //   isClosable: true,
        // });
        console.log("Story");
      }
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Error deleting story!",
      //   status: "error",
      //   duration: 3000,
      //   isClosable: true,
      // });
      console.log("Erroe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">
            Delete <Trash weight="bold" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This story will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={handleDelete}
            >
              {isLoading ? (
                <p>Deleting</p>
              ) : (
                <div className="flex items-center gap-1">
                  <p>Delete</p>
                  <Trash weight="bold" />
                </div>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteButton;
