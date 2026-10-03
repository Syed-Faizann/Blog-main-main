"use client";

import React, { useState } from "react";

export default function NewsletterForm({ variant = "footer" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'already' | 'error'
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    try {
      setStatus("loading");
      setFeedback("");

      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      if (data.alreadySubscribed) {
        setStatus("already");
        setFeedback(data.message || "You are already subscribed!");
      } else {
        setStatus("success");
        setFeedback(data.message || "Thank you! You're officially on the dispatch list.");
        setEmail("");
      }
    } catch (err) {
      setStatus("error");
      setFeedback(err.message || "Something went wrong. Please try again.");
    }
  }

  // Sidebar compact variant
  if (variant === "sidebar") {
    return (
      <div className="space-y-3">
        {status === "success" || status === "already" ? (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-emerald-400 text-base shrink-0 mt-0.5">
              check_circle
            </span>
            <div>
              <p className="font-bold text-white mb-0.5">
                {status === "already" ? "Already Subscribed!" : "You're On The List!"}
              </p>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed">{feedback}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-400 transition"
            />
            {status === "error" && (
              <p className="text-[11px] text-rose-300 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">error</span>
                <span>{feedback}</span>
              </p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <>
                  <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </form>
        )}
      </div>
    );
  }

  // Footer large banner variant (matches user's screenshot)
  return (
    <div className="w-full">
      {status === "success" || status === "already" ? (
        <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/40 text-emerald-200 flex items-center gap-3 animate-in fade-in duration-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-emerald-400 text-2xl">
              mark_email_read
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-0.5">
              {status === "already" ? "You're already subscribed!" : "Welcome to Chronicle Weekly!"}
            </h4>
            <p className="text-xs text-emerald-300/90">{feedback}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1 relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              required
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            {status === "error" && (
              <p className="absolute -bottom-5 left-1 text-[11px] text-rose-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">error</span>
                <span>{feedback}</span>
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Subscribing...</span>
              </>
            ) : (
              <span>Subscribe</span>
            )}
          </button>
        </form>
      )}
      <p className="text-[11px] text-slate-500 mt-2.5">
        By subscribing, you agree to our Privacy Policy and Terms.
      </p>
    </div>
  );
}
