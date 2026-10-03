"use client";

import React, { useEffect, useState } from "react";

export default function TableOfContents() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // Look for headings inside the article body
    const article = document.getElementById("article-content");
    const items = [];

    if (article) {
      const headingElements = article.querySelectorAll("h1, h2, h3, h4, h5, h6");

      if (headingElements.length > 0) {
        headingElements.forEach((el, index) => {
          if (!el.id) {
            el.id = `section-heading-${index}`;
          }
          // Add scroll margin so sticky nav doesn't cover heading
          el.classList.add("scroll-mt-28");

          items.push({
            id: el.id,
            text: el.innerText.trim() || `Section ${index + 1}`,
            level: el.tagName.toLowerCase(),
          });
        });
      }
    }

    // If no explicit h1-h6 headings were found in HTML, provide working landmarks
    if (items.length === 0) {
      items.push(
        { id: "article-start", text: "Story Introduction" },
        { id: "article-content", text: "Main Content" },
        { id: "author-bio", text: "About the Author" },
        { id: "comments-section", text: "Community Discussion" }
      );
    } else {
      // Always include comments at the end
      items.push({ id: "comments-section", text: "Community Discussion" });
    }

    setHeadings(items);
    if (items.length > 0) setActiveId(items[0].id);

    // Scroll listener for active state
    const handleScroll = () => {
      const scrollY = window.scrollY;

      for (let i = items.length - 1; i >= 0; i--) {
        const el = document.getElementById(items[i].id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 140;
          if (scrollY >= top) {
            setActiveId(items[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -110;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 shadow-xs border border-slate-200/80 bg-white">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-indigo-600 text-base">
          toc
        </span>
        In this Story
      </h4>

      <nav className="space-y-1.5 text-xs font-medium">
        {headings.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-indigo-50/90 text-indigo-700 font-bold shadow-2xs border border-indigo-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                  isActive ? "bg-indigo-600 scale-125" : "bg-slate-300"
                }`}
              />
              <span className="truncate">{item.text}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
