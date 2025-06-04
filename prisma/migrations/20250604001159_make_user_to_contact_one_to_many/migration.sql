/*
  Warnings:

  - You are about to drop the column `username` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the `_ContactToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contactUserId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ContactToUser" DROP CONSTRAINT "_ContactToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContactToUser" DROP CONSTRAINT "_ContactToUser_B_fkey";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "username",
ADD COLUMN     "contactUserId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ContactToUser";

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_contactUserId_fkey" FOREIGN KEY ("contactUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
