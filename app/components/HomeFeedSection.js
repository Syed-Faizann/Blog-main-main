"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import LoadMorePosts from "./LoadMorePosts";
import { FILTER_CATEGORIES } from "@/lib/categories";

export default function HomeFeedSection({ initialPosts = [], banner }) {
  const [selectedCategory, setSelectedCategory] = useState("All Stories");

  const filteredPosts = useMemo(() => {
    if (!initialPosts || initialPosts.length === 0) return [];
    if (selectedCategory === "All Stories") return initialPosts;
    return initialPosts.filter(
      (p) =>
        (p.category || "Engineering").toLowerCase() ===
        selectedCategory.toLowerCase()
    );
  }, [initialPosts, selectedCategory]);

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const feedPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-8 mb-16">
        {FILTER_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs sm:text-sm px-4 py-2 rounded-full font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-102"
                  : "bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/70"
              }`}
            >
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* When stories exist */}
      {featuredPost ? (
        <>
          {/* Featured Spotlight Card */}
          <section className="mb-20">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-600 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">stars</span>
                {selectedCategory === "All Stories"
                  ? "Editor's Spotlight"
                  : `Top in ${selectedCategory}`}
              </span>
              <span className="text-xs text-slate-400 font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/60">
                {featuredPost.category || "Story"}
              </span>
            </div>

            <Link
              href={`/posts/${featuredPost.slug}`}
              className="group relative block rounded-3xl overflow-hidden glass-card glass-card-hover p-4 sm:p-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Spotlight Image */}
                <div className="lg:col-span-7 relative h-[280px] sm:h-[400px] rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                  <Image
                    src={featuredPost.image || banner}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      Featured Read
                    </span>
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {featuredPost.category || "Engineering"}
                    </span>
                  </div>
                </div>

                {/* Spotlight Details */}
                <div className="lg:col-span-5 flex flex-col justify-between py-2 sm:py-4">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-3">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-indigo-500">
                          schedule
                        </span>
                        5 min read
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(featuredPost.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-3 leading-snug tracking-tight mb-4">
                      {featuredPost.title}
                    </h2>

                    <p className="text-sm sm:text-base text-slate-500 line-clamp-3 leading-relaxed mb-6">
                      {featuredPost.excerpt ||
                        "Explore ideas that redefine what is possible in the modern digital landscape."}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-sm flex items-center justify-center overflow-hidden ring-2 ring-white shadow-xs">
                        {featuredPost.author?.image ? (
                          <Image
                            src={featuredPost.author.image}
                            alt={featuredPost.author.name || "Author"}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <span>
                            {featuredPost.author?.name
                              ? featuredPost.author.name[0].toUpperCase()
                              : "C"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {featuredPost.author?.name || "Curator"}
                        </p>
                        <p className="text-[11px] text-slate-400">Author & Contributor</p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                      Read Story
                      <span className="material-symbols-outlined text-base">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>

          {/* Feed Header */}
          <div id="explore" className="scroll-mt-24 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-slate-200/80">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {selectedCategory === "All Stories"
                    ? "Latest Dispatches"
                    : `${selectedCategory} Stories`}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedCategory === "All Stories"
                    ? "Fresh articles, essays, and technical breakdowns."
                    : `Perspectives and insights in ${selectedCategory}.`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/70">
                  {filteredPosts.length} {filteredPosts.length === 1 ? "Story" : "Stories"}
                </span>
              </div>
            </div>

            {/* Posts Grid with Load More */}
            <LoadMorePosts
              initialPosts={feedPosts}
              selectedCategory={selectedCategory}
            />
          </div>
        </>
      ) : (
        /* Empty category state */
        <div className="text-center py-20 px-6 glass-card rounded-3xl border border-dashed border-slate-300 max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">category</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No stories in &ldquo;{selectedCategory}&rdquo; yet
          </h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
            Be the first thinker to contribute perspectives and deep dives in this category.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSelectedCategory("All Stories")}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              View All Stories
            </button>
            <Link
              href="/posts/create"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition"
            >
              <span className="material-symbols-outlined text-base">edit_square</span>
              <span>Write a {selectedCategory} Story</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
