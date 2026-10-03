"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { UploadButton } from "@/lib/upload-thing";

const AVATAR_PRESETS = [
  {
    id: "preset-1",
    name: "Design Lead",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "preset-2",
    name: "Product Architect",
    url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "preset-3",
    name: "Creative Technologist",
    url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "preset-4",
    name: "Engineering Fellow",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "preset-5",
    name: "Editorial Curator",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "preset-6",
    name: "Cyber Persona",
    url: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=300&q=80",
  },
];

export default function UserProfileModal({ isOpen, onClose }) {
  const { data: session, update } = useSession();

  const [activeTab, setActiveTab] = useState("upload"); // 'upload' | 'url' | 'presets'
  const [currentImage, setCurrentImage] = useState(session?.user?.image || null);
  const [userName, setUserName] = useState(session?.user?.name || "");
  const [customUrl, setCustomUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sync state whenever session or modal open changes
  useEffect(() => {
    if (isOpen && session?.user) {
      setCurrentImage(session.user.image || null);
      setUserName(session.user.name || "");
      setCustomUrl("");
      setSavedSuccess(false);
      setErrorMessage("");
    }
  }, [isOpen, session]);

  if (!isOpen || !session?.user) return null;

  const userInitial = userName ? userName[0].toUpperCase() : "U";

  async function handleSaveProfile(e) {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage("");
      setSavedSuccess(false);

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: currentImage,
          name: userName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update NextAuth client session
      await update({
        image: currentImage,
        name: userName,
      });

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3500);
    } catch (err) {
      console.error("Save profile error:", err);
      setErrorMessage(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  }

  function handleApplyCustomUrl(e) {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setCurrentImage(customUrl.trim());
    setCustomUrl("");
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 transition-all">
        {/* Header Background Banner */}
        <div className="relative h-28 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 p-6 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/15 text-[11px] font-bold tracking-wider uppercase">
              <span className="material-symbols-outlined text-xs text-indigo-400">badge</span>
              Account Details
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 pt-0 bg-white">
          {/* Avatar Area (Only Avatar protrudes) */}
          <div className="flex items-end justify-between -mt-12 mb-4">
            {/* Avatar Preview */}
            <div className="relative w-24 h-24 rounded-full p-1 bg-white shadow-xl ring-4 ring-slate-100 shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-3xl font-extrabold text-white relative">
                {currentImage ? (
                  <Image
                    src={currentImage}
                    alt={userName || "User Avatar"}
                    fill
                    className="object-cover"
                    sizes="96px"
                    unoptimized
                  />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>

              {/* Status indicator */}
              <div
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs"
                title="Account Active"
              >
                <span className="material-symbols-outlined text-white text-[14px]">check</span>
              </div>
            </div>

            {/* Remove / Reset Image Button if avatar exists */}
            {currentImage && (
              <button
                type="button"
                onClick={() => setCurrentImage(null)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                <span>Reset Photo</span>
              </button>
            )}
          </div>

          {/* User Name & Email - 100% on pure white background for crisp visibility */}
          <div className="mb-6 pb-5 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {userName || "Chronicle Writer"}
              </h3>
              <span className="material-symbols-outlined text-indigo-600 text-xl" title="Verified Creator">
                verified
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100/80 ml-auto">
                Author & Contributor
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-slate-600 text-sm font-medium">
              <span className="material-symbols-outlined text-base text-slate-400">mail</span>
              <span>{session.user.email}</span>
            </div>
          </div>

          {/* Feedback Alerts */}
          {savedSuccess && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
              <span>Account profile updated successfully!</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600 text-base">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Edit Name Field */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-semibold text-slate-800 transition"
            />
          </div>

          {/* Change Avatar Methods Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Change Profile Photo
              </label>

              {/* Method Switcher Tabs */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeTab === "upload"
                      ? "bg-white text-indigo-600 shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("url")}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeTab === "url"
                      ? "bg-white text-indigo-600 shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("presets")}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    activeTab === "presets"
                      ? "bg-white text-indigo-600 shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Presets
                </button>
              </div>
            </div>

            {/* Tab 1: Upload */}
            {activeTab === "upload" && (
              <div className="p-4 rounded-2xl bg-indigo-50/40 border border-dashed border-indigo-200 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs text-indigo-600 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-xl">add_a_photo</span>
                </div>
                <p className="text-xs font-bold text-slate-800 mb-0.5">
                  Upload an image from your device
                </p>
                <p className="text-[11px] text-slate-400 mb-3">
                  JPG, PNG or WEBP (up to 4MB)
                </p>
                <div className="scale-90 origin-center">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        const url = res[0].ufsUrl || res[0].url;
                        setCurrentImage(url);
                      }
                    }}
                    onUploadError={(error) => {
                      alert(`Upload error: ${error.message}`);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Paste URL */}
            {activeTab === "url" && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Paste any web link from Unsplash, Imgur, or your portfolio.
                </p>
              </div>
            )}

            {/* Tab 3: Presets */}
            {activeTab === "presets" && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                {AVATAR_PRESETS.map((p) => {
                  const isSelected = currentImage === p.url;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCurrentImage(p.url)}
                      title={p.name}
                      className={`relative aspect-square rounded-2xl overflow-hidden ring-2 transition-all p-0.5 cursor-pointer ${
                        isSelected
                          ? "ring-indigo-600 scale-105 shadow-md shadow-indigo-600/20"
                          : "ring-transparent hover:ring-slate-300"
                      }`}
                    >
                      <Image
                        src={p.url}
                        alt={p.name}
                        fill
                        className="object-cover rounded-[14px]"
                        sizes="64px"
                        unoptimized
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-base">check</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href="/my-posts"
                onClick={onClose}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition"
              >
                <span className="material-symbols-outlined text-base">dashboard</span>
                <span>My Posts</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  signOut({ callbackUrl: "/" });
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Sign Out</span>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-600/25 transition disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
