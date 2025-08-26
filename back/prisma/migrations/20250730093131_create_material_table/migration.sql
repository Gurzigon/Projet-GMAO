/*
  Warnings:

  - You are about to drop the column `detail` on the `Intervention` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_parentId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialIntervention" DROP CONSTRAINT "MaterialIntervention_materialId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialPreventive" DROP CONSTRAINT "MaterialPreventive_materialId_fkey";

-- AlterTable
ALTER TABLE "Documentation" ALTER COLUMN "mimetype" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Intervention" DROP COLUMN "detail",
ADD COLUMN     "requestor_firstname" TEXT,
ADD COLUMN     "requestor_lastname" TEXT;

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "parentGroupId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "validation_code" INTEGER NOT NULL DEFAULT 1111;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_parentGroupId_fkey" FOREIGN KEY ("parentGroupId") REFERENCES "Parent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialPreventive" ADD CONSTRAINT "MaterialPreventive_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialIntervention" ADD CONSTRAINT "MaterialIntervention_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
