"use client";

import React, { useState, useEffect } from "react";

export default function PostInteractiveBar({ title }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Top Scroll Reading Progress Line */}
      <div
        style={{ width: `${scrollProgress}%` }}
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-[60] transition-all duration-150 ease-out"
      />

      {/* Share Bar */}
      <div className="flex items-center justify-between py-2.5 px-4 sm:px-6 rounded-2xl glass-card shadow-xs border border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="material-symbols-outlined text-indigo-600 text-base">
            menu_book
          </span>
          <span>Reading Mode</span>
        </div>

        {/* Share buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline mr-1">
            Share story:
          </span>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            title="Copy link to clipboard"
            className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/70 hover:border-indigo-200 transition relative cursor-pointer flex items-center gap-1.5 text-xs font-medium"
          >
            <span className="material-symbols-outlined text-base">
              {copied ? "check" : "link"}
            </span>
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            {copied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap animate-in fade-in zoom-in-90 duration-150">
                Copied to clipboard!
              </span>
            )}
          </button>

          {/* Twitter / X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              title || "Check out this article on Chronicle"
            )}&url=${
              typeof window !== "undefined"
                ? encodeURIComponent(window.location.href)
                : ""
            }`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on Twitter"
            className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/70 hover:border-indigo-200 transition cursor-pointer"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${
              typeof window !== "undefined"
                ? encodeURIComponent(window.location.href)
                : ""
            }`}
            target="_blank"
            rel="noopener noreferrer"
            title="Share on LinkedIn"
            className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/70 hover:border-indigo-200 transition cursor-pointer"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
