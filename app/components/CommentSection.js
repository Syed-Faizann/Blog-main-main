"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import me from "@/public/me2.jpg";
import { createComment } from "@/lib/actions/createcomment";
import { fetchComments } from "@/lib/actions/fetchComments";
import CommentList from "@/app/components/CommentList";

export default function CommentSection({ postId, currentUser }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isPending, startTransition] = useTransition();

  const refreshComments = async () => {
    if (!postId) return;
    try {
      const data = await fetchComments(postId);
      setComments(data || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  useEffect(() => {
    startTransition(refreshComments);
  }, [postId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim() || !postId) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("content", comment);
        formData.append("postId", postId);

        await createComment(formData);
        setComment("");
        await refreshComments();
      } catch (err) {
        console.error("Failed to post comment:", err);
      }
    });
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-indigo-600 text-2xl">
            forum
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Discussion
          </h3>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
            {comments.length}
          </span>
        </div>
      </div>

      {/* Comment Input */}
      <form
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-4 sm:p-5 mb-10 shadow-xs border border-slate-200/80"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 ring-2 ring-indigo-100 shrink-0">
            <Image
              src={currentUser?.image || me}
              alt="Current user"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>

          <div className="flex-1">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What are your thoughts on this story?..."
              rows={3}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
            />

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                Be kind, respectful, and constructive.
              </span>
              <button
                type="submit"
                disabled={isPending || !comment.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isPending ? (
                  <span>Posting...</span>
                ) : (
                  <>
                    <span>Submit</span>
                    <span className="material-symbols-outlined text-sm">send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comment List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          <CommentList
            comments={comments}
            postId={postId}
            currentUser={currentUser}
            refreshComments={refreshComments}
          />
        </div>
      ) : (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200">
          <span className="material-symbols-outlined text-3xl text-slate-300 mb-2">
            chat_bubble_outline
          </span>
          <p className="text-sm font-semibold text-slate-600">No comments yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Start the conversation by sharing your thoughts above!
          </p>
        </div>
      )}
    </div>
  );
}
