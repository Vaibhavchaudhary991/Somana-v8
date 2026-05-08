"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
// import { useToast } from "@chakra-ui/react";

const AddComment = ({ session, hostname, blogId, authorId }) => {
  // const toast = useToast();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await axios.post(
        `/api/v1/comments`,
        {
          content,
          blogId: blogId,
          author: authorId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setContent("");
      setSuccess(true);

      // toast({
      //   title: "Comment added",
      //   description: "Comment added successfully",
      //   status: "success",
      //   duration: 2000,
      //   isClosable: true,
      // });
    } catch (err) {
      // toast({
      //   title: "Error",
      //   description: "Comment not added",
      //   status: "error",
      //   duration: 2000,
      //   isClosable: true,
      // });
    } finally {
      setLoading(false);
    }
  };

  // if (session.user.role == "user") {
  //   return <div></div>;
  // }

  return (
    <div className="add-comment w-full mx-auto p-2 bg-white dark:bg-black rounded-md">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <img className="size-8 rounded-md" src={`${session.user.photo}`} />
        <div className="w-full flex flex-col gap-2 border rounded-md p-1.5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write comment here"
            className="p-1 outline-none resize-none rounded-md text-sm"
            rows="3"
            required
          />

          <Button type="submit" className="w-fit ml-auto" disabled={loading}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
      <div className=" text-sm font-medium my-1">
        {success ? (
          <p className="bg-green-100 p-1 px-2 rounded-sm">
            Comment Added Successfully
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default AddComment;
