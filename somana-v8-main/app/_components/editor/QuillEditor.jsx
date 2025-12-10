"use client";
import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const QuillEditor = ({ value, onChange }) => {
  return (
    <div>
      <ReactQuill
        className="text-stone-800 dark:text-white"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default QuillEditor;
