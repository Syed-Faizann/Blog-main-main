import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body?.email ? body.email.trim().toLowerCase() : "";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Ensure NewsletterSubscriber table exists in Postgres
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "NewsletterSubscriber" (
        "id" TEXT PRIMARY KEY,
        "email" TEXT UNIQUE NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Check if already subscribed
    const existing = await prisma.$queryRawUnsafe(
      `SELECT "id" FROM "NewsletterSubscriber" WHERE "email" = $1 LIMIT 1;`,
      email
    );

    if (existing && existing.length > 0) {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        message: "You're already on our weekly dispatch list! Thank you for reading.",
      });
    }

    // Insert new subscriber
    const id = "sub_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
    await prisma.$executeRawUnsafe(
      `INSERT INTO "NewsletterSubscriber" ("id", "email") VALUES ($1, $2);`,
      id,
      email
    );

    return NextResponse.json({
      success: true,
      message: "You're all set! Stories and architectural breakdowns will arrive in your inbox every Tuesday.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Could not complete subscription right now. Please try again." },
      { status: 500 }
    );
  }
}
