"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import me from "@/public/me2.jpg";
import { createComment } from "@/lib/actions/createcomment";

export default function CommentList({
  comments,
  postId,
  currentUser,
  refreshComments,
}) {
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleReplySubmit(e, parentId) {
    e.preventDefault();
    if (!replyText.trim()) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("content", replyText);
        formData.append("postId", postId);
        formData.append("parentId", parentId);

        await createComment(formData);

        setReplyText("");
        setReplyingToId(null);

        if (refreshComments) await refreshComments();
      } catch (err) {
        console.error("Failed to post reply:", err);
      }
    });
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs transition hover:border-slate-300"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 ring-2 ring-indigo-50 shrink-0">
              <Image
                src={comment.user?.image || me}
                alt="User"
                width={36}
                height={36}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    {comment.user?.name || "Community Member"}
                  </h4>
                  <span className="text-[11px] text-slate-400">•</span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <button
                  onClick={() =>
                    setReplyingToId(replyingToId === comment.id ? null : comment.id)
                  }
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                >
                  <span className="material-symbols-outlined text-sm">reply</span>
                  Reply
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">
                {comment.content}
              </p>

              {/* Reply Form */}
              {replyingToId === comment.id && (
                <form
                  onSubmit={(e) => handleReplySubmit(e, comment.id)}
                  className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2.5"
                >
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.user?.name || "this comment"}...`}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyingToId(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition"
                    >
                      {isPending ? "Replying..." : "Post Reply"}
                    </button>
                  </div>
                </form>
              )}

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-indigo-100 space-y-3">
                  <CommentList
                    comments={comment.replies}
                    postId={postId}
                    currentUser={currentUser}
                    refreshComments={refreshComments}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
