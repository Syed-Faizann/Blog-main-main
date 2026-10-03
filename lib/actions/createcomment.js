"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function createComment(formData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error("Not authenticated");
  }

  const content = formData.get("content")?.toString();
  const postId = formData.get("postId")?.toString();
  const parentId = formData.get("parentId")?.toString() || null;

  if (!content || !postId) {
    throw new Error("Missing required fields");
  }

  // Check that the post exists
  const postExists = await prisma.post.findUnique({ where: { id: postId } });
  if (!postExists) {
    throw new Error("Invalid postId: post does not exist");
  }

  // Check that parent comment exists (if replying)
  if (parentId) {
    const parentExists = await prisma.comment.findUnique({ where: { id: parentId } });
    if (!parentExists) {
      throw new Error("Invalid parentId: parent comment does not exist");
    }
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      parentId,
      userId: session.user.id,
    },
  });

  return comment;
}
