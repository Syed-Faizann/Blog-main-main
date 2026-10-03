"use client";

import React, { useState, useTransition } from "react";
import { deleteBlog } from "@/lib/actions/deleteBlog";
import { useRouter } from "next/navigation";

export default function DeletePostButton({ postId, postTitle }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${postTitle}"? This cannot be undone.`)) {
      startTransition(async () => {
        try {
          await deleteBlog(postId);
          router.refresh();
        } catch (err) {
          alert(`Failed to delete: ${err.message}`);
        }
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      title="Delete Story"
      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/60 hover:border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-lg">
        {isPending ? "hourglass_empty" : "delete"}
      </span>
    </button>
  );
}
