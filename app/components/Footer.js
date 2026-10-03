"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/me2.jpg";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const footerSections = [
    {
      title: "Editorial",
      links: [
        { label: "Technology", href: "/" },
        { label: "Design Systems", href: "/" },
        { label: "AI & Innovation", href: "/" },
        { label: "Engineering Culture", href: "/" },
        { label: "Editor's Picks", href: "/" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Write for Us", href: "/posts/create" },
        { label: "Contributor Guidelines", href: "/" },
        { label: "Discussion Forums", href: "/" },
        { label: "Events & Meetups", href: "/" },
      ],
    },
    {
      title: "Chronicle",
      links: [
        { label: "About Journal", href: "/" },
        { label: "Manifesto", href: "/" },
        { label: "Press & Media", href: "/" },
        { label: "Brand Assets", href: "/" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/" },
        { label: "Terms of Service", href: "/" },
        { label: "Cookie Settings", href: "/" },
        { label: "Security", href: "/" },
      ],
    },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 mt-28 border-t border-slate-900">
      {/* Newsletter Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 border-b border-slate-900">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-8 sm:p-12 border border-indigo-900/40 overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-widest font-bold text-indigo-400 mb-2 block">
                Stay Ahead
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                Stories that provoke thought, delivered every Tuesday.
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
                Join 24,000+ engineers, designers, and creators who start their week with our curated digests. No spam, ever.
              </p>
            </div>

            <div className="lg:col-span-5">
              <NewsletterForm variant="footer" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 group mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                  <Image
                    src={logo}
                    alt="Logo"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Chronicle<span className="text-indigo-500">.</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm mb-6">
              An independent journal exploring design intuition, modern software engineering,
              and transformative ideas.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Links */}
          {footerSections.map((sec, idx) => (
            <div key={idx}>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
                {sec.title}
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {sec.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-14 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Chronicle Publishing Group. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Twitter / X
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              RSS Feed
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
