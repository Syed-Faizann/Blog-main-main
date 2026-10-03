"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createBlog(formData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error("Not authenticated");
  }

  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const category = formData.get("category")?.toString() || "Engineering";

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  // Make slug unique by appending a timestamp suffix
  const slug = `${baseSlug}-${Date.now()}`;

  const excerpt = content.replace(/<[^>]*>?/gm, "").slice(0, 150) + "...";

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      image: imageUrl || null,
      category,
      authorId: session.user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/my-posts");

  return post.slug;
}