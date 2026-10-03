import { prisma } from "@/lib/prisma";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import LoadMorePosts from "@/app/components/LoadMorePosts";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PostsOverviewPage() {
  let posts = [];
  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { author: true },
    });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-sm">auto_stories</span>
            The Archive
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            All Stories & Explorations
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Browse through our full library of essays, tutorials, and perspectives from
            contributing writers and creative technologists.
          </p>
        </div>

        {/* Posts Grid */}
        <LoadMorePosts initialPosts={posts} />
      </main>

      <Footer />
    </>
  );
}
