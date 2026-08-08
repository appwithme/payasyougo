-- Live passenger ratings + rating count on drivers
ALTER TABLE "Driver" ADD COLUMN IF NOT EXISTS "ratingCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Transaction" ADD COLUMN IF NOT EXISTS "passengerRating" INTEGER;
ALTER TABLE "Transaction" ADD COLUMN IF NOT EXISTS "ratedAt" TIMESTAMP(3);

-- New drivers start unrated until passengers rate them
UPDATE "Driver" SET "rating" = 0 WHERE "ratingCount" = 0;
