"use client";

import React, { useState } from "react";
import Image from "next/image";
import UserProfileModal from "./UserProfileModal";

export default function ProfileEditTrigger({ user, postsCount = 0 }) {
  const [open, setOpen] = useState(false);
  const initial = user?.name ? user.name[0].toUpperCase() : "U";

  return (
    <>
      <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-0.5 shadow-md shadow-indigo-500/15 shrink-0">
            <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-100 flex items-center justify-center text-xl font-bold text-indigo-700 relative">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            <button
              onClick={() => setOpen(true)}
              title="Change Profile Photo"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">photo_camera</span>
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {user?.name || "Chronicle Writer"}
              </h2>
              <span className="material-symbols-outlined text-indigo-600 text-base" title="Verified Creator">
                verified
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {user?.email}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {postsCount} {postsCount === 1 ? "Story Published" : "Stories Published"}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl border border-indigo-100 transition cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <span className="material-symbols-outlined text-base">manage_accounts</span>
          <span>Edit Profile & Photo</span>
        </button>
      </div>

      <UserProfileModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
