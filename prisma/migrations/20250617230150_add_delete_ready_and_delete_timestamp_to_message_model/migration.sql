/*
  Warnings:

  - Added the required column `delete_timestamp` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "delete_ready" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "delete_timestamp" TIMESTAMP(3) NOT NULL;
