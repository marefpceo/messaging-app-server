/*
  Warnings:

  - You are about to drop the `_ConversationToMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ConversationToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `messageId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ConversationToMessage" DROP CONSTRAINT "_ConversationToMessage_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationToMessage" DROP CONSTRAINT "_ConversationToMessage_B_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationToUser" DROP CONSTRAINT "_ConversationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationToUser" DROP CONSTRAINT "_ConversationToUser_B_fkey";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "messageId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ConversationToMessage";

-- DropTable
DROP TABLE "_ConversationToUser";

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
