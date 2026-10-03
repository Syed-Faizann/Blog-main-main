// app/posts/[slug]/page.js
import { prisma } from "@/lib/prisma";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CommentSection from "@/app/components/CommentSection";
import PostInteractiveBar from "@/app/components/PostInteractiveBar";
import TableOfContents from "@/app/components/TableOfContents";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import me from "@/public/me2.jpg";
import banner from "@/public/banner.jpg";
import Link from "next/link";
import NewsletterForm from "@/app/components/NewsletterForm";
import { formatViews } from "@/lib/format";

export default async function PostPage({ params: rawParams }) {
  const params = await rawParams;
  const slug = params?.slug;

  if (!slug) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
            <span className="material-symbols-outlined text-3xl">error</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Slug missing</h2>
          <p className="text-slate-500 mb-6">No post slug was provided in the URL.</p>
          <Link
            href="/"
            className="text-sm font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition"
          >
            ← Return to Homepage
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  let post = null;
  let relatedPosts = [];
  let viewsCount = 1;
  try {
    post = await prisma.post.findUnique({
      where: { slug },
      include: { author: true },
    });

    if (post) {
      // Safely increment and query live view count in PostgreSQL
      try {
        await prisma.$executeRawUnsafe(
          'UPDATE "Post" SET "views" = COALESCE("views", 0) + 1 WHERE "slug" = $1;',
          slug
        );
        const viewRes = await prisma.$queryRawUnsafe(
          'SELECT "views" FROM "Post" WHERE "slug" = $1 LIMIT 1;',
          slug
        );
        viewsCount = viewRes?.[0]?.views || 1;
      } catch (err) {
        console.error("View increment error:", err);
      }

      const currentCategory = post.category || "Engineering";
      const categoryFilter =
        !post.category || post.category.toLowerCase() === "engineering"
          ? {
              OR: [
                { category: { equals: "Engineering", mode: "insensitive" } },
                { category: null },
              ],
            }
          : { category: { equals: currentCategory, mode: "insensitive" } };

      relatedPosts = await prisma.post.findMany({
        where: {
          NOT: { slug },
          ...categoryFilter,
        },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { author: true },
      });
    }
  } catch (error) {
    console.error("Failed to fetch post:", error);
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">sentiment_dissatisfied</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Story Not Found</h2>
          <p className="text-slate-500 mb-6">
            The article you are looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="text-sm font-semibold bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition"
          >
            ← Back to All Stories
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const session = await getServerSession(authOptions);
  const currentUser = session?.user || null;

  const postCategory = post.category || "Engineering";

  // Approximate reading time
  const wordCount = post.content ? post.content.replace(/<[^>]*>/g, " ").split(/\s+/).length : 200;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <>
      <Navbar />

      <main className="w-full pt-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Bar */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 overflow-hidden">
            <Link href="/" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">home</span>
              Home
            </Link>
            <span>/</span>
            <Link href="/posts" className="hover:text-indigo-600 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-slate-600 truncate max-w-[240px] sm:max-w-md">
              {post.title}
            </span>
          </nav>

          {/* Reading Mode & Share Bar - with dedicated container and breathing room */}
          <div className="mb-10">
            <PostInteractiveBar title={post.title} />
          </div>

          {/* Article Header */}
          <header id="article-start" className="max-w-4xl mx-auto lg:mx-0 mb-10 scroll-mt-28">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 border border-indigo-100/80 font-bold text-xs uppercase tracking-wider shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                {postCategory}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                <span className="material-symbols-outlined text-xs text-indigo-500">schedule</span>
                {readTimeMinutes} min read
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                <span className="material-symbols-outlined text-xs text-indigo-500">visibility</span>
                <span>{formatViews(viewsCount)}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-8">
              {post.title}
            </h1>

            {/* Author Byline Bar (Audio option removed per request) */}
            <div className="flex items-center justify-between py-4 px-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3.5">
                <Link
                  href={post.author?.id ? `/authors/${post.author.id}` : "#"}
                  className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 p-0.5 flex items-center justify-center ring-2 ring-indigo-50 shadow-xs hover:scale-105 transition-transform"
                  title="View Author Stories"
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center font-bold text-indigo-700">
                    {post.author?.image ? (
                      <Image
                        src={post.author.image}
                        alt={post.author.name || "Author"}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <Image
                        src={me}
                        alt="Author"
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                </Link>

                <div>
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={post.author?.id ? `/authors/${post.author.id}` : "#"}
                      className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors"
                      title="View Author Stories"
                    >
                      {post.author?.name || "Curator"}
                    </Link>
                    <span className="material-symbols-outlined text-indigo-600 text-base" title="Verified Author">
                      verified
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Published</span>
                    <span>•</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {currentUser?.id === post.authorId ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/posts/${post.slug}/edit`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-600/25 transition transform hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    <span>Edit Post</span>
                  </Link>
                  <Link
                    href="/my-posts"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                  >
                    <span>My Posts</span>
                  </Link>
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                  Chronicle Verified
                </span>
              )}
            </div>
          </header>

          {/* Two-Column Layout (Main Article + Functional Sticky Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left / Main Column */}
            <article className="lg:col-span-8 w-full">
              {/* Cover Visual */}
              {post.image && (
                <div className="relative w-full aspect-[16/9] sm:aspect-[21/10] rounded-3xl overflow-hidden shadow-xl mb-10 border border-slate-200/80 bg-slate-100 group">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-40" />
                </div>
              )}

              {/* Article Content Box */}
              <div className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200/80 bg-white">
                {/* Visual Article Callout Header */}
                <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-slate-50 to-purple-50/80 border border-indigo-100/70 flex items-start gap-3">
                  <span className="material-symbols-outlined text-indigo-600 text-xl mt-0.5">
                    auto_awesome
                  </span>
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-0.5">
                      Editorial Overview
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      This article presents an architectural breakdown, key workflows, and technical
                      recommendations carefully curated for development teams.
                    </p>
                  </div>
                </div>

                {/* Rich HTML body with id for TableOfContents navigation */}
                <div
                  id="article-content"
                  className="prose max-w-none text-slate-800 leading-relaxed break-words scroll-mt-28"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Article Footer Stats */}
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Peer-reviewed for accuracy and design standards</span>
                  </div>
                  {post.updatedAt && (
                    <span>
                      Revision:{" "}
                      {new Date(post.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Author Bio Banner */}
              <div id="author-bio" className="mt-10 rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center gap-6 shadow-xl border border-slate-800 scroll-mt-28">
                <Link
                  href={post.author?.id ? `/authors/${post.author.id}` : "#"}
                  className="w-16 h-16 rounded-2xl bg-indigo-500/20 p-1 shrink-0 overflow-hidden ring-2 ring-indigo-400/40 hover:scale-105 transition-transform"
                  title="View Author Stories"
                >
                  <Image
                    src={post.author?.image || me}
                    alt={post.author?.name || "Author"}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full rounded-xl"
                    unoptimized
                  />
                </Link>
                <div className="text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <Link
                      href={post.author?.id ? `/authors/${post.author.id}` : "#"}
                      className="text-lg font-bold text-white hover:text-indigo-300 transition-colors"
                      title="View Author Stories"
                    >
                      {post.author?.name || "Curator"}
                    </Link>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                      Author
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Lead contributor and system architect. Exploring modern cloud databases,
                    framework innovations, and scalable design systems.
                  </p>
                </div>
                <Link
                  href={post.author?.id ? `/authors/${post.author.id}` : "/posts"}
                  className="shrink-0 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>All Stories by {post.author?.name ? post.author.name.split(" ")[0] : "Author"} →</span>
                </Link>
              </div>

              {/* Comments Section */}
              <section id="comments-section" className="mt-16 pt-10 border-t border-slate-200 scroll-mt-28">
                <CommentSection postId={post.id} currentUser={currentUser} />
              </section>
            </article>

            {/* Right Sticky Sidebar with working TableOfContents & working Links */}
            <aside className="lg:col-span-4 w-full space-y-8 sticky top-24">
              {/* Fully Functional Table of Contents */}
              <TableOfContents />

              {/* Functional Related Stories Card */}
              <div className="glass-card rounded-2xl p-6 shadow-xs border border-slate-200/80 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-600 text-base">
                      auto_stories
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Related Stories
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2 py-0.5 rounded-full">
                    {postCategory}
                  </span>
                </div>

                {relatedPosts && relatedPosts.length > 0 ? (
                  <div className="space-y-3">
                    {relatedPosts.map((rPost, idx) => (
                      <Link
                        key={idx}
                        href={`/posts/${rPost.slug}`}
                        className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                      >
                        <div className="relative w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                          <Image
                            src={rPost.image || banner}
                            alt={rPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                            {rPost.category || postCategory}
                          </span>
                          <h5 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mt-1">
                            {rPost.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(rPost.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 px-3 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                    <span className="material-symbols-outlined text-2xl text-slate-400 mb-1">
                      category
                    </span>
                    <p className="text-xs font-semibold text-slate-700 mb-1">
                      No other stories in &ldquo;{postCategory}&rdquo; yet
                    </p>
                    <p className="text-[11px] text-slate-400 mb-4">
                      Share another perspective in this category!
                    </p>
                    <Link
                      href="/posts/create"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition"
                    >
                      <span className="material-symbols-outlined text-sm">edit_square</span>
                      <span>Write in {postCategory}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Newsletter Callout in Sidebar */}
              <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-900 to-violet-950 text-white shadow-lg">
                <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-300 block mb-2">
                  Weekly Dispatch
                </span>
                <h4 className="text-base font-bold text-white mb-2">
                  Never miss an architectural breakdown.
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Curated essays, technical deep dives, and design inspiration directly in your inbox.
                </p>
                <NewsletterForm variant="sidebar" />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
