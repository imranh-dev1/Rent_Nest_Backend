/*
  Warnings:

  - You are about to drop the column `method` on the `payments` table. All the data in the column will be lost.
  - Added the required column `tenantId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "method",
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "tenantId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "transactionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
