const { prisma } = require("../lib/prisma");

async function main() {
  try {
    const list = await prisma.$queryRawUnsafe(
      'SELECT id, email, "createdAt" FROM "NewsletterSubscriber" ORDER BY "createdAt" DESC;'
    );
    console.log(`\n📬 Total Newsletter Subscribers: ${list.length}\n`);
    if (list.length > 0) {
      console.table(list);
    } else {
      console.log("No subscribers yet.");
    }
  } catch (err) {
    console.error("Error reading subscribers:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
