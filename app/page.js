import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeFeedSection from "./components/HomeFeedSection";
import banner from "@/public/banner.jpg";

export const dynamic = "force-dynamic";

export default async function Home() {
  let posts = [];
  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { author: true },
    });
  } catch (error) {
    console.error("Failed to fetch posts from database:", error);
  }

  return (
    <>
      <Navbar />

      {/* Decorative ambient background mesh */}
      <div className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-indigo-300/40 via-violet-300/30 to-sky-200/40 opacity-70"
          />
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          {/* Hero Header */}
          <section className="text-center max-w-4xl mx-auto pt-6 pb-6">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-indigo-100 shadow-sm text-xs font-semibold text-indigo-700 mb-6 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span>The Journal of Modern Craft, Tech & Ideas</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] mb-6">
              Ideas that shape the{" "}
              <span className="gradient-text">digital frontier</span>.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              Curated perspectives on design craftsmanship, software engineering,
              and creative technology from thinkers around the globe.
            </p>
          </section>

          {/* Interactive Category Filter & Feed */}
          <HomeFeedSection initialPosts={posts} banner={banner} />
        </main>
      </div>

      <Footer />
    </>
  );
}
