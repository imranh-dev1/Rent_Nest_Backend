/*
  Warnings:

  - The `availability` column on the `properties` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PropertyAvailability" AS ENUM ('RENTED', 'AVAILABLE', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "availability",
ADD COLUMN     "availability" "PropertyAvailability" NOT NULL DEFAULT 'AVAILABLE';
