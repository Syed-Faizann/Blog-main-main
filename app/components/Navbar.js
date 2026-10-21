"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import logo from "@/public/me2.jpg";
import UserProfileModal from "./UserProfileModal";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <header className="sticky top-2 sm:top-4 z-50 px-3 sm:px-8 max-w-7xl mx-auto w-full transition-all">
      <nav className="glass-nav rounded-2xl px-3 sm:px-6 py-2.5 sm:py-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-between transition-all">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
            <div className="w-full h-full bg-white rounded-[10px] overflow-hidden flex items-center justify-center">
              <Image
                src={logo}
                alt="Chronicle Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Chronicle<span className="text-indigo-600">.</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 hidden sm:block -mt-1">
              Tech & Design Journal
            </span>
          </div>
        </Link>

        {/* Navigation Links using semantic ul / li */}
        <nav aria-label="Main Navigation" className="main-nav-container items-center">
          <ul className="flex items-center gap-1 sm:gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70 text-sm font-semibold text-slate-600 list-none m-0 shadow-2xs">
            <li>
              <Link
                href="/"
                className="px-3.5 py-1.5 rounded-xl hover:text-indigo-600 hover:bg-white transition-all block text-slate-700 font-semibold"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/posts"
                className="px-3.5 py-1.5 rounded-xl hover:text-indigo-600 hover:bg-white transition-all block text-slate-700 font-semibold"
              >
                Blog
              </Link>
            </li>
            {session && (
              <>
                <li>
                  <Link
                    href="/my-posts"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-indigo-700 bg-white shadow-2xs hover:bg-indigo-50 font-bold transition-all border border-indigo-100"
                  >
                    <span className="material-symbols-outlined text-base">dashboard</span>
                    <span>My Posts</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts/create"
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-white transition-all font-semibold"
                  >
                    <span className="material-symbols-outlined text-base">edit_square</span>
                    <span>Write</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {session ? (
            <div className="flex items-center gap-1.5 sm:gap-3">
              <Link
                href="/my-posts"
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
                title="Manage your stories"
              >
                <span className="material-symbols-outlined text-base">article</span>
                <span>My Articles</span>
              </Link>

              {/* User badge - Clicking opens Account Details & Change Image Modal */}
              <div className="flex items-center gap-1 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-200">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  title="Click to view Account Details & Change Photo"
                  className="group flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer text-left"
                >
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 p-0.5 flex items-center justify-center text-xs font-bold text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <span>{session.user?.name ? session.user.name[0].toUpperCase() : "U"}</span>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  {session.user?.name && (
                    <span className="text-xs font-bold text-slate-700 hidden md:inline truncate max-w-[100px] group-hover:text-indigo-600 transition-colors">
                      {session.user.name.split(" ")[0]}
                    </span>
                  )}
                  <span className="material-symbols-outlined text-slate-400 text-sm hidden md:inline-block group-hover:text-indigo-600 transition-colors">
                    expand_more
                  </span>
                </button>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Sign Out"
                  className="text-slate-400 hover:text-rose-500 p-1 sm:p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                href="/login"
                className="text-slate-600 hover:text-slate-900 font-semibold text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl hover:bg-slate-100/80 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-sm shadow-indigo-500/25 hover:shadow-md hover:shadow-indigo-500/35 transition-all transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger-btn text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer with semantic ul / li */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer mt-2 p-4 glass-card rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="flex flex-col gap-2 list-none m-0 p-0 text-slate-700 font-semibold text-sm">
            <li>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2 rounded-xl hover:bg-slate-100"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/posts"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2 rounded-xl hover:bg-slate-100"
              >
                Blog
              </Link>
            </li>
            {session ? (
              <>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setProfileModalOpen(true);
                    }}
                    className="w-full text-left flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition cursor-pointer"
                  >
                    <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 p-0.5 flex items-center justify-center text-xs font-bold text-white shadow-xs shrink-0">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="Avatar"
                          width={36}
                          height={36}
                          className="rounded-full w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span>{session.user?.name ? session.user.name[0].toUpperCase() : "U"}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
                        <span>{session.user?.name || "Account Profile"}</span>
                        <span className="material-symbols-outlined text-indigo-600 text-xs">verified</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{session.user?.email}</div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                      Edit
                    </span>
                  </button>
                </li>
                <li>
                  <Link
                    href="/my-posts"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-indigo-700 bg-indigo-50 font-bold border border-indigo-100"
                  >
                    <span className="material-symbols-outlined text-base">dashboard</span>
                    <span>My Posts (View & Edit)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/posts/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-indigo-600 hover:bg-slate-100 font-semibold"
                  >
                    <span className="material-symbols-outlined text-base">edit_square</span>
                    <span>Write Post</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="pt-2 border-t border-slate-200">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3.5 py-2 rounded-xl text-slate-700 hover:bg-slate-100"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3.5 py-2.5 rounded-xl text-white bg-indigo-600 font-bold text-center"
                  >
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* Account Profile Details & Change Photo Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </header>
  );
}
