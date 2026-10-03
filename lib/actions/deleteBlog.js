"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function deleteBlog(postId) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error("Not authenticated");
  }

  if (!postId) {
    throw new Error("Post ID is required");
  }

  const existing = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!existing) {
    throw new Error("Post not found");
  }

  if (existing.authorId !== session.user.id) {
    throw new Error("Unauthorized to delete this post");
  }

  // Delete comments and likes first to maintain integrity
  await prisma.comment.deleteMany({ where: { postId } });
  await prisma.like.deleteMany({ where: { postId } });
  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/my-posts");

  return { success: true };
}
