"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function updateBlog(formData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error("Not authenticated");
  }

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const category = formData.get("category")?.toString();

  if (!id || !title || !content) {
    throw new Error("Missing required fields");
  }

  // Verify ownership
  const existing = await prisma.post.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Post not found");
  }

  if (existing.authorId !== session.user.id) {
    throw new Error("Unauthorized: You can only edit your own posts");
  }

  const excerpt = content.replace(/<[^>]*>?/gm, "").slice(0, 150) + "...";

  const updateData = {
    title,
    content,
    excerpt,
  };

  if (category) {
    updateData.category = category;
  }

  if (imageUrl !== undefined) {
    updateData.image = imageUrl ? imageUrl : null;
  }

  const updated = await prisma.post.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath(`/posts/${updated.slug}`);
  revalidatePath("/my-posts");

  return updated.slug;
}
