-- CreateTable
CREATE TABLE IF NOT EXISTS "Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "quote" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Testimonial_isPublished_idx" ON "Testimonial"("isPublished");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Testimonial_createdAt_idx" ON "Testimonial"("createdAt");
