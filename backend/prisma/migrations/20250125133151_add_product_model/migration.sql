/*
  Warnings:

  - You are about to drop the column `content` on the `Product` table. All the data in the column will be lost.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "content",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ALTER COLUMN "name" SET NOT NULL;
