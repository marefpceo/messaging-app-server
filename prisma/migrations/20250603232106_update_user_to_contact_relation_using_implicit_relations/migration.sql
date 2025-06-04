/*
  Warnings:

  - You are about to drop the column `contactUserId` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `username` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "contactUserId",
DROP COLUMN "userId",
ADD COLUMN     "username" TEXT NOT NULL;
