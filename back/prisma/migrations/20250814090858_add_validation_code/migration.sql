/*
  Warnings:

  - A unique constraint covering the columns `[validation_code]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "validation_code" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "User_validation_code_key" ON "public"."User"("validation_code");
