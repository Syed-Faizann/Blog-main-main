"use server";

import { prisma } from "@/lib/prisma";

export async function fetchComments(postId) {
  if (!postId) throw new Error("Post ID is required");

  // Fetch all comments for the post
  const allComments = await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  // Recursive function to build nested tree
  function buildTree(comments, parentId = null) {
    return comments
      .filter(c => c.parentId === parentId)
      .map(c => ({
        ...c,
        replies: buildTree(comments, c.id),
      }));
  }

  return buildTree(allComments);
}
