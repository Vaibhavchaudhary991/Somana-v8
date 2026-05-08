"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogDate from "./BlogDate";
// import { Spinner } from "@chakra-ui/react";

const BlogComments = ({ hostname, blogId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogComments = async () => {
    try {
      const res = await axios.get(`/api/v1/comments?blogId=${blogId}&limit=5`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      setComments(res.data.data.comments);
      setLoading(false);
    } catch (err) {
      setError(err.message || "An error occurred while fetching comments.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogComments();
  }, [blogId]);

  if (loading)
    return (
      <div>
        {/* <Spinner size="md" /> */}
        <p>Loading</p>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full mx-auto p-2 bg-white dark:bg-black rounded-md">
      {/* <h2 className="flex items-center gap-2 font-medium mb-4 text-md text-stone-700 dark:text-stone-200">
        Comments <ArrowRight />
      </h2> */}
      <div className="flex flex-col gap-2">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment comment={comment} key={comment._id} />
          ))
        ) : (
          <p className="text-stone-600">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

const Comment = ({ comment }) => {
  return (
    <div className="flex gap-4 font-medium dark:bg-black  rounded-md">
      <div className="h-8 w-8 flex-shrink-0">
        <img
          src={comment.author.photo}
          className="h-full w-full rounded-md object-cover"
          alt={`${comment.author.name}'s profile`}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium dark:text-stone-200 text-stone-800 ">
            {comment.author.name}
          </p>
          <div className="text-xs dark:text-stone-400 text-stone-500">
            <BlogDate blogDate={comment.createdAt}></BlogDate>
          </div>
        </div>
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  );
};

export default BlogComments;
