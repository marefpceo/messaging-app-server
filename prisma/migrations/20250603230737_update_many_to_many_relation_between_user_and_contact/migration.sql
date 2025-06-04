-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_contactUserId_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_userId_fkey";

-- CreateTable
CREATE TABLE "_ContactToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ContactToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ContactToUser_B_index" ON "_ContactToUser"("B");

-- AddForeignKey
ALTER TABLE "_ContactToUser" ADD CONSTRAINT "_ContactToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToUser" ADD CONSTRAINT "_ContactToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
