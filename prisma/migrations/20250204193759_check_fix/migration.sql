/*
  Warnings:

  - You are about to drop the `UserAddress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `addresses` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserAddress" DROP CONSTRAINT "UserAddress_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "addresses" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserAddress";
