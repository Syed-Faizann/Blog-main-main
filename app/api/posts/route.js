import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (slug) {
    try {
      const post = await prisma.post.findUnique({
        where: { slug },
        include: { author: true },
      });
      return Response.json({ post, posts: post ? [post] : [] });
    } catch (error) {
      return Response.json({ error: "Failed to fetch post" }, { status: 500 });
    }
  }

  const page = parseInt(searchParams.get("page") || "1");
  const limit = 8;
  const skip = (page - 1) * limit;

  const category = searchParams.get("category");
  const where = category && category !== "All Stories" ? { category } : {};

  try {
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { author: true },
    });

    return Response.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ posts: [], error: "Failed to fetch posts" }, { status: 500 });
  }
}
