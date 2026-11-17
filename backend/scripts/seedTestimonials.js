import prisma from '../src/config/prismaClient.js';

const defaults = [
  { name: 'Mariam Ali', role: 'Founder, StartupX', quote: 'ABUHUB built our MVP in record time — excellent communication and quality.' },
  { name: 'Omar Hassan', role: 'CTO, FinServe', quote: 'Their team delivered a polished product that customers love.' },
  { name: 'Leila N.', role: 'Head of Product, RetailCo', quote: 'Professional, fast, and highly skilled — recommended.' },
];

async function ensureTable() {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "Testimonial" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "role" TEXT,
      "quote" TEXT NOT NULL,
      "avatarUrl" TEXT,
      "isPublished" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
  `;
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Testimonial_isPublished_idx" ON "Testimonial"("isPublished");`;
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Testimonial_createdAt_idx" ON "Testimonial"("createdAt");`;
}

async function run() {
  try {
    await ensureTable();

    for (const t of defaults) {
      const existing = await prisma.$queryRaw`
        SELECT "id" FROM "Testimonial" WHERE "name" = ${t.name} AND "quote" = ${t.quote} LIMIT 1
      `;

      if (existing.length > 0) {
        console.log('Already exists:', t.name);
        continue;
      }

      console.log('Creating:', t.name);
      await prisma.$executeRaw`
        INSERT INTO "Testimonial" ("id","name","role","quote","avatarUrl","isPublished","createdAt","updatedAt")
        VALUES (lower(hex(randomblob(16))), ${t.name}, ${t.role}, ${t.quote}, NULL, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
    }

    const rows = await prisma.$queryRaw`SELECT COUNT(1) as count FROM "Testimonial"`;
    console.log('Total testimonials now:', String(rows[0]?.count ?? 0));
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
