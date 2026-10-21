"use client";

import React, { useState, useTransition, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { UploadButton } from "@/lib/upload-thing";
import { updateBlog } from "@/lib/actions/updateBlog";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const TextEditor = dynamic(() => import("@/app/components/TextEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 text-sm">
      Loading editor...
    </div>
  ),
});

import { CATEGORIES } from "@/lib/categories";

export default function EditPostPage() {
  const params = useParams();
  const slug = params?.slug;
  const router = useRouter();
  const { data: session, status } = useSession();

  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [imageUrl, setImageUrl] = useState(null);
  const [customUrl, setCustomUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    async function fetchPostData() {
      try {
        setLoadingPost(true);
        const res = await fetch(`/api/posts?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        const found = data.post;

        if (found) {
          setPost(found);
          setTitle(found.title || "");
          setCategory(found.category || "Engineering");
          setImageUrl(found.image || null);
          setContent(found.content || "");
        } else {
          setError("Story not found.");
        }
      } catch (err) {
        console.error("Failed to load story for editing:", err);
        setError("Failed to load story data.");
      } finally {
        setLoadingPost(false);
      }
    }

    fetchPostData();
  }, [slug]);

  if (status === "loading" || loadingPost) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-500 font-medium text-sm">Loading story details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sign In Required</h2>
          <p className="text-slate-500 mb-6">You must be logged in to edit this story.</p>
          <Link
            href="/login"
            className="text-sm font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition"
          >
            Sign In Now
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{error || "Story not found"}</h2>
          <Link
            href="/my-posts"
            className="text-sm font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition mt-4"
          >
            Back to My Stories
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="w-full min-w-0 max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        {/* Editor Top Bar */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              href="/my-posts"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to My Stories
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Editing Mode
              </span>
            </div>
          </div>

          <Link
            href={`/posts/${post.slug}`}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span className="hidden sm:inline">View Published</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </Link>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("id", post.id);
            formData.append("title", title);
            formData.append("category", category);
            formData.append("content", content);
            if (imageUrl !== undefined) {
              formData.append("imageUrl", imageUrl || "");
            }

            startTransition(async () => {
              try {
                const updatedSlug = await updateBlog(formData);
                router.refresh();
                router.push(`/posts/${updatedSlug}`);
              } catch (err) {
                alert(`Error saving changes: ${err.message}`);
              }
            });
          }}
          className="space-y-6 sm:space-y-8 w-full min-w-0"
        >
          {/* Cover Image Upload Area */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Cover Visual
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition cursor-pointer self-start sm:self-auto"
              >
                {showUrlInput ? "Hide URL Option" : "Paste Image URL"}
              </button>
            </div>

            {/* Paste URL Option */}
            {showUrlInput && (
              <div className="mb-4 p-3 sm:p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="Paste an image URL (e.g. https://...)"
                  className="min-w-0 flex-1 px-3.5 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrl.trim()) {
                      setImageUrl(customUrl.trim());
                      setCustomUrl("");
                      setShowUrlInput(false);
                    }
                  }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer shrink-0"
                >
                  Apply URL
                </button>
              </div>
            )}

            {imageUrl ? (
              <div className="relative w-full aspect-[21/9] sm:h-80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200 group">
                <Image
                  src={imageUrl}
                  alt="Post cover"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                    Remove / Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 text-center transition-colors shadow-xs">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-2xl sm:text-3xl">add_photo_alternate</span>
                </div>
                <h4 className="font-bold text-sm sm:text-base text-slate-800 mb-1">
                  Upload Cover Image
                </h4>
                <p className="text-xs text-slate-400 mb-5 sm:mb-6">
                  Select a JPG, PNG or WEBP from your computer (up to 4MB)
                </p>

                <div className="flex flex-col items-center justify-center w-full max-w-full">
                  <UploadButton
                    endpoint="imageUploader"
                    appearance={{
                      button:
                        "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm px-5 sm:px-8 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 max-w-full text-center",
                      allowedContent: "text-xs text-slate-500 font-medium mt-3 text-center",
                    }}
                    content={{
                      button({ ready, isUploading }) {
                        if (isUploading) return "Uploading image...";
                        if (ready) return "📁 Choose Cover Image";
                        return "Preparing Uploader...";
                      },
                      allowedContent() {
                        return "PNG, JPG, WEBP (up to 4MB)";
                      },
                    }}
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        const url = res[0].ufsUrl || res[0].url;
                        setImageUrl(url);
                      }
                    }}
                    onUploadError={(error) => {
                      alert(`Upload error: ${error.message}`);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Story Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your story a compelling title..."
              className="w-full min-w-0 text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 placeholder-slate-300 bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none py-2.5 sm:py-3 transition tracking-tight"
              required
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    category === cat
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                      : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${category === cat ? "bg-indigo-400" : "bg-slate-300"}`} />
                  <span>{cat}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Readers will find your post when exploring this category.
            </p>
          </div>

          {/* Text Editor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Story Body
            </label>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <TextEditor content={content} onChange={setContent} />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-6 border-t border-slate-200">
            <Link
              href="/my-posts"
              className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 text-center sm:text-left py-2"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="w-full sm:w-auto justify-center bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm px-8 py-3 rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <span>Save Changes</span>
                  <span className="material-symbols-outlined text-base">check</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
}
