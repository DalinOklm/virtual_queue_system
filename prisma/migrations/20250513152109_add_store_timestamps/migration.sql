/*
  Warnings:

  - Added the required column `updatedAt` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Store" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Store" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now();

