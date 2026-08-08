-- AlterTable
ALTER TABLE "Driver" ADD COLUMN "ghanaCardNumber" TEXT,
ADD COLUMN "ghanaCardVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "licenseNumber" TEXT,
ADD COLUMN "licenseVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Driver_ghanaCardNumber_key" ON "Driver"("ghanaCardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_licenseNumber_key" ON "Driver"("licenseNumber");
