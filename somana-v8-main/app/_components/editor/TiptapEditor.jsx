"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  LinkIcon,
  UnlinkIcon,
  Code2Icon,
  HighlighterIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  PaintBucketIcon,
  EraserIcon,
  Undo2Icon,
  Redo2Icon,
} from "lucide-react";

const TiptapEditor = ({
  content,
  onChange,
  placeholder = "Write something...",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      TextStyle,
      Color,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[200px] focus:outline-none p-4",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    immediatelyRender: false, // Add this line to fix SSR hydration
  });

  const setLink = React.useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700">
        {/* History */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          title="Undo"
        >
          <Undo2Icon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          title="Redo"
        >
          <Redo2Icon className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("bold") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Bold"
        >
          <BoldIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("italic") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Italic"
        >
          <ItalicIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("underline") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("strike") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Strikethrough"
        >
          <StrikethroughIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("highlight") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Highlight"
        >
          <HighlighterIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("code") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Inline Code"
        >
          <CodeIcon className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Headings */}
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-100 dark:bg-gray-800"
              : ""
          }`}
          title="Heading 1"
        >
          <Heading1Icon className="w-4 h-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-100 dark:bg-gray-800"
              : ""
          }`}
          title="Heading 2"
        >
          <Heading2Icon className="w-4 h-4" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("heading", { level: 3 })
              ? "bg-gray-100 dark:bg-gray-800"
              : ""
          }`}
          title="Heading 3"
        >
          <Heading3Icon className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("bulletList") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Bullet List"
        >
          <ListIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("orderedList") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Numbered List"
        >
          <ListOrderedIcon className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Blocks */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("blockquote") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Blockquote"
        >
          <QuoteIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("codeBlock") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Code Block"
        >
          <Code2Icon className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Links */}
        <button
          onClick={setLink}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive("link") ? "bg-gray-100 dark:bg-gray-800" : ""
          }`}
          title="Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        {editor.isActive("link") && (
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Remove Link"
          >
            <UnlinkIcon className="w-4 h-4" />
          </button>
        )}

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Text Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive({ textAlign: "left" })
              ? "bg-gray-100 dark:bg-gray-800"
              : ""
          }`}
          title="Align Left"
        >
          <AlignLeftIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive({ textAlign: "center" })
              ? "bg-gray-100 dark:bg-gray-800"
              : ""
          }`}
          title="Align Center"
        >
          <AlignCenterIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${
            editor.isActive({ textAlign: "right" })
              ? "bg-gray-100 dark:bg-gray-800"
              : ""
          }`}
          title="Align Right"
        >
          <AlignRightIcon className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Color */}
        <input
          type="color"
          onInput={(event) =>
            editor.chain().focus().setColor(event.target.value).run()
          }
          value={editor.getAttributes("textStyle").color || "#000000"}
          className="w-8 h-8 rounded cursor-pointer"
          title="Text Color"
        />
        <button
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Reset Color"
        >
          <PaintBucketIcon className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

        {/* Clear Formatting */}
        <button
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500"
          title="Clear Formatting"
        >
          <EraserIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="rounded-b-lg bg-white dark:bg-gray-900"
      />
    </div>
  );
};

export default TiptapEditor;
