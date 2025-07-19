-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "recipienct_read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sender_read" BOOLEAN NOT NULL DEFAULT false;
