import { prisma } from "@/lib/prisma";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import DeletePostButton from "@/app/components/DeletePostButton";
import ProfileEditTrigger from "@/app/components/ProfileEditTrigger";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import banner from "@/public/banner.jpg";
import { formatViews } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function MyPostsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return (
      <>
        <Navbar />
        <main className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">account_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Sign In Required</h2>
          <p className="text-slate-500 mb-6 max-w-sm">
            Please sign in to view, edit, or manage the stories you have published.
          </p>
          <Link
            href="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            Sign In to Your Account
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  let userPosts = [];
  try {
    userPosts = await prisma.post.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load user posts:", error);
  }

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-sm">dashboard</span>
              Creator Studio
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              My Stories
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage, edit, or create new blog posts published under your account.
            </p>
          </div>

          <Link
            href="/posts/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/25 transition-all self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-base">edit_square</span>
            <span>Write New Story</span>
          </Link>
        </div>

        {/* User Profile Overview & Avatar Trigger */}
        <ProfileEditTrigger
          user={session.user}
          postsCount={userPosts ? userPosts.length : 0}
        />

        {/* Stories List */}
        {userPosts && userPosts.length > 0 ? (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <div
                key={post.id}
                className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200/80 bg-white hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="relative w-24 h-20 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/60">
                    <Image
                      src={post.image || banner}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {post.category || "Engineering"}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-500">
                        <span className="material-symbols-outlined text-[13px] text-indigo-500">visibility</span>
                        <span>{formatViews(post.views || 0)}</span>
                      </span>
                    </div>

                    <Link href={`/posts/${post.slug}`}>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                      {post.excerpt || "No excerpt preview available."}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                  {/* View */}
                  <Link
                    href={`/posts/${post.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60 transition"
                  >
                    <span className="material-symbols-outlined text-base">visibility</span>
                    <span>View</span>
                  </Link>

                  {/* Edit */}
                  <Link
                    href={`/posts/${post.slug}/edit`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    <span>Edit</span>
                  </Link>

                  {/* Delete */}
                  <DeletePostButton postId={post.id} postTitle={post.title} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 glass-card rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">auto_stories</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              You haven&apos;t written any stories yet
            </h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
              Share your insights, code tutorials, or design perspectives with the world.
            </p>
            <Link
              href="/posts/create"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">edit_square</span>
              <span>Write Your First Story</span>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
