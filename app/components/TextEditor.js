"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";

export default function TextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "list-disc pl-6 my-3",
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: "list-decimal pl-6 my-3",
          },
        },
      }),
      Underline,
      Highlight,
      Link.configure({
        openOnClick: true,
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none outline-none min-h-[280px] p-5 text-slate-800 text-base leading-relaxed",
        "data-placeholder": "Start writing your narrative...",
      },
    },
    content: content || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== undefined && editor.getHTML() !== content) {
      if (!editor.isFocused) {
        editor.commands.setContent(content || "");
      }
    }
  }, [content, editor]);

  useEffect(() => {
    return () => {
      if (editor) editor.destroy();
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
        <div className="p-6 min-h-[280px] flex items-center justify-center text-slate-400 text-sm">
          Loading editor...
        </div>
      </div>
    );
  }

  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = prompt("Enter link URL:");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
      {/* Sleek Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50 border-b border-slate-200">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
          className={`p-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            editor.isActive("bold")
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-200/80"
          }`}
        >
          <span className="material-symbols-outlined text-base">format_bold</span>
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
          className={`p-2 rounded-lg text-xs transition cursor-pointer ${
            editor.isActive("italic")
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-200/80"
          }`}
        >
          <span className="material-symbols-outlined text-base">format_italic</span>
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
          className={`p-2 rounded-lg text-xs transition cursor-pointer ${
            editor.isActive("underline")
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-200/80"
          }`}
        >
          <span className="material-symbols-outlined text-base">format_underlined</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200 mx-1" />

        {/* Heading 2 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
            editor.isActive("heading", { level: 2 })
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-200/80"
          }`}
        >
          <span className="material-symbols-outlined text-base">title</span>
          <span>H2</span>
        </button>

        {/* Heading 3 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
            editor.isActive("heading", { level: 3 })
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-200/80"
          }`}
        >
          <span className="material-symbols-outlined text-base">title</span>
          <span>H3</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200 mx-1" />

        {/* Bullet (Dotted) List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Dotted Bullet List"
          className={`p-2 rounded-lg text-xs transition flex items-center justify-center cursor-pointer ${
            editor.isActive("bulletList")
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-200/80"
          }`}
        >
          <span className="material-symbols-outlined text-base">format_list_bulleted</span>
        </button>

        {/* Numbered (Numeric) List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numeric Numbered List"
          className={`p-2 rounded-lg text-xs transition flex items-center justify-center cursor-pointer ${
            editor.isActive("orderedList")
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-200/80"
          }`}
        >
          <span className="material-symbols-outlined text-base">format_list_numbered</span>
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
          className={`p-2 rounded-lg text-xs transition cursor-pointer ${
            editor.isActive("blockquote")
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-200/80"
          }`}
        >
          <span className="material-symbols-outlined text-base">format_quote</span>
        </button>

        {/* Highlight */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title="Highlight Text"
          className={`p-2 rounded-lg text-xs transition cursor-pointer ${
            editor.isActive("highlight")
              ? "bg-amber-400 text-slate-900 shadow-xs"
              : "text-slate-700 hover:bg-slate-200/80"
          }`}
        >
          <span className="material-symbols-outlined text-base">ink_highlighter</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          title="Add Link"
          className={`p-2 rounded-lg text-xs transition cursor-pointer ${
            editor.isActive("link")
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-200/80"
          }`}
        >
          <span className="material-symbols-outlined text-base">link</span>
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={addImage}
          title="Embed Image URL"
          className="p-2 rounded-lg text-xs text-slate-700 hover:bg-slate-200/80 transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">image</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200 mx-1" />

        {/* Text Alignments */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          title="Align Left"
          className={`p-2 rounded-lg text-xs transition cursor-pointer ${
            editor.isActive({ textAlign: "left" })
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-200/80"
          }`}
        >
          <span className="material-symbols-outlined text-base">format_align_left</span>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          title="Align Center"
          className={`p-2 rounded-lg text-xs transition cursor-pointer ${
            editor.isActive({ textAlign: "center" })
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-slate-700 hover:bg-slate-200/80"
          }`}
        >
          <span className="material-symbols-outlined text-base">format_align_center</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200 mx-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo (Ctrl+Z)"
          className="p-2 rounded-lg text-xs text-slate-700 hover:bg-slate-200/80 transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">undo</span>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo (Ctrl+Y)"
          className="p-2 rounded-lg text-xs text-slate-700 hover:bg-slate-200/80 transition cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">redo</span>
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent
        editor={editor}
        className="w-full min-h-[280px] bg-white cursor-text"
      />
    </div>
  );
}