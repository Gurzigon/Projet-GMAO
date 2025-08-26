/*
  Warnings:

  - A unique constraint covering the columns `[label,serviceId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Category_label_key";

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "serviceId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Category_label_serviceId_key" ON "public"."Category"("label", "serviceId");

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
