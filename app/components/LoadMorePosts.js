"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoadMorePosts({ initialPosts = [], selectedCategory = "All Stories" }) {
  const [posts, setPosts] = useState(initialPosts || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPosts(initialPosts || []);
    setPage(1);
    setHasMore(true);
  }, [selectedCategory, initialPosts]);

  async function loadMore() {
    try {
      setLoading(true);
      const catQuery = selectedCategory && selectedCategory !== "All Stories" ? `&category=${encodeURIComponent(selectedCategory)}` : "";
      const res = await fetch(`/api/posts?page=${page + 1}${catQuery}`);
      const data = await res.json();

      if (!data.posts || data.posts.length < 8) {
        setHasMore(false);
      }

      if (data.posts && data.posts.length > 0) {
        setPosts((prev) => [...prev, ...data.posts]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Failed to load more posts:", err);
    } finally {
      setLoading(false);
    }
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20 px-4 glass-card rounded-3xl border border-dashed border-slate-300">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl">auto_stories</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {selectedCategory && selectedCategory !== "All Stories"
            ? `No stories in "${selectedCategory}" yet`
            : "No stories yet"}
        </h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
          Be the pioneer writer in this domain. Share your insights, tutorials, or perspectives.
        </p>
        <Link
          href="/posts/create"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Write Story
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <article
            key={post.id || post.slug || idx}
            className="group glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 bg-white"
          >
            <Link href={`/posts/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100">
              <Image
                src={post.image || "/placeholder.jpg"}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-3 left-3">
                <span className="text-[11px] uppercase tracking-wider font-bold bg-white/90 backdrop-blur-md text-indigo-700 px-2.5 py-1 rounded-full shadow-xs">
                  {post.category || "Story"}
                </span>
              </div>
            </Link>

            {/* Post details */}
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-3">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-indigo-500">
                    schedule
                  </span>
                  4 min read
                </span>
                <span>•</span>
                <span>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <Link href={`/posts/${post.slug}`}>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug tracking-tight mb-2">
                  {post.title}
                </h3>
              </Link>

              <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-6">
                {post.excerpt ||
                  "Discover in-depth discussions, technical deep dives, and expert commentary crafted for discerning readers."}
              </p>

              {/* Author & Read more footer */}
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Link
                    href={post.author?.id ? `/authors/${post.author.id}` : "#"}
                    className="flex items-center gap-2 hover:text-indigo-600 transition group/author"
                    title={`View stories by ${post.author?.name || "Author"}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-xs flex items-center justify-center overflow-hidden ring-2 ring-white shadow-xs group-hover/author:scale-105 transition-transform">
                      {post.author?.image ? (
                        <Image
                          src={post.author.image}
                          alt={post.author.name || "Author"}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span>{post.author?.name ? post.author.name[0].toUpperCase() : "A"}</span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 group-hover/author:text-indigo-600 transition-colors line-clamp-1">
                      {post.author?.name || "Curator"}
                    </span>
                  </Link>
                </div>

                <Link
                  href={`/posts/${post.slug}`}
                  className="text-xs font-bold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1 transition-colors"
                >
                  <span>Read</span>
                  <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-16 mb-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-semibold text-sm shadow-sm hover:shadow-md hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-indigo-600"
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
                <span>Loading more stories...</span>
              </>
            ) : (
              <>
                <span>Load More Stories</span>
                <span className="material-symbols-outlined text-base group-hover:translate-y-0.5 transition-transform">
                  expand_more
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
