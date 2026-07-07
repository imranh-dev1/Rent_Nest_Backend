/*
  Warnings:

  - Added the required column `address` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `area` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bathrooms` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedrooms` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentAmount` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "area" INTEGER NOT NULL,
ADD COLUMN     "availability" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "bathrooms" INTEGER NOT NULL,
ADD COLUMN     "bedrooms" INTEGER NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "rentAmount" DOUBLE PRECISION NOT NULL;
