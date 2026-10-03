import { prisma } from "@/lib/prisma";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import Link from "next/link";
import banner from "@/public/banner.jpg";
import { formatViews } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AuthorProfilePage({ params: rawParams }) {
  const params = await rawParams;
  const authorId = params?.id;

  if (!authorId) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Author Not Found</h2>
          <Link href="/" className="text-sm font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-xl">
            ← Return to Homepage
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  let author = null;
  let authorPosts = [];

  try {
    author = await prisma.user.findUnique({
      where: { id: authorId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (author) {
      authorPosts = await prisma.post.findMany({
        where: { authorId: author.id },
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          _count: { select: { comments: true } },
        },
      });
    }
  } catch (error) {
    console.error("Failed to load author profile:", error);
  }

  if (!author) {
    return (
      <>
        <Navbar />
        <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">person_off</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Author Not Found</h2>
          <p className="text-slate-500 mb-6">
            We couldn&apos;t locate the author profile you requested.
          </p>
          <Link
            href="/"
            className="text-sm font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition"
          >
            ← Back to Homepage
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const authorInitial = author.name ? author.name[0].toUpperCase() : "A";
  const joinedDate = new Date(author.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Unique categories this author has written in
  const authorCategories = Array.from(
    new Set(authorPosts.map((p) => p.category || "Engineering"))
  );

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-8">
          <Link href="/" className="hover:text-indigo-600 transition flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">home</span>
            Home
          </Link>
          <span>/</span>
          <Link href="/posts" className="hover:text-indigo-600 transition">
            Authors
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-bold">{author.name}</span>
        </nav>

        {/* Author Header Card */}
        <section className="mb-14 relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            {/* Author Avatar */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-1 shadow-2xl shrink-0 ring-4 ring-indigo-500/30">
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-800 flex items-center justify-center text-4xl font-extrabold text-white relative">
                {author.image ? (
                  <Image
                    src={author.image}
                    alt={author.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                    unoptimized
                  />
                ) : (
                  <span>{authorInitial}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center" title="Active Contributor">
                <span className="material-symbols-outlined text-white text-sm">check</span>
              </div>
            </div>

            {/* Author Metadata */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {author.name}
                </h1>
                <span className="material-symbols-outlined text-indigo-400 text-2xl" title="Verified Author">
                  verified
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                  Lead Contributor
                </span>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
                Contributing writer and domain specialist on Chronicle. Exploring modern design patterns,
                software architecture, and technical innovation.
              </p>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs">
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10 text-slate-200 font-semibold">
                  <span className="material-symbols-outlined text-base text-indigo-400">auto_stories</span>
                  <span>{authorPosts.length} {authorPosts.length === 1 ? "Story" : "Stories"} Published</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10 text-slate-200 font-semibold">
                  <span className="material-symbols-outlined text-base text-indigo-400">calendar_month</span>
                  <span>Joined {joinedDate}</span>
                </div>
                {authorCategories.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10 text-slate-200 font-semibold">
                    <span className="material-symbols-outlined text-base text-indigo-400">category</span>
                    <span>Topics: {authorCategories.slice(0, 3).join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stories Section Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Stories by {author.name.split(" ")[0]}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              All essays, articles, and research published by this author.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            {authorPosts.length} {authorPosts.length === 1 ? "Article" : "Articles"}
          </span>
        </div>

        {/* Stories Grid */}
        {authorPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authorPosts.map((post) => {
              const postCategory = post.category || "Engineering";
              const wordCount = post.content ? post.content.replace(/<[^>]*>/g, " ").split(/\s+/).length : 200;
              const readTime = Math.max(1, Math.ceil(wordCount / 180));
              const publishDate = new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <article
                  key={post.id}
                  className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 bg-white hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <Link href={`/posts/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <Image
                      src={post.image || banner}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-900 backdrop-blur-md shadow-xs">
                        {postCategory}
                      </span>
                    </div>
                  </Link>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-2">
                        <span>{publishDate}</span>
                        <span>•</span>
                        <span>{readTime} min read</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <span className="material-symbols-outlined text-[13px] text-indigo-500">visibility</span>
                          <span>{formatViews(post.views || 0)}</span>
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 tracking-tight leading-snug mb-3">
                        <Link href={`/posts/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed mb-6 font-normal">
                        {post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 140) + "..."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">comment</span>
                        {post._count?.comments || 0}
                      </span>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-xs font-bold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1 group/btn"
                      >
                        <span>Read Story</span>
                        <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 px-6 glass-card rounded-3xl border border-dashed border-slate-300 max-w-xl mx-auto my-8">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">article</span>
            <h3 className="text-xl font-bold text-slate-800 mb-1">No stories published yet</h3>
            <p className="text-xs text-slate-500 mb-6">
              This author hasn&apos;t published any articles yet.
            </p>
            <Link
              href="/"
              className="text-xs font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition"
            >
              Browse All Stories
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
