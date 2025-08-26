-- DropForeignKey
ALTER TABLE "public"."MaterialPreventive" DROP CONSTRAINT "MaterialPreventive_preventiveId_fkey";

-- AddForeignKey
ALTER TABLE "public"."MaterialPreventive" ADD CONSTRAINT "MaterialPreventive_preventiveId_fkey" FOREIGN KEY ("preventiveId") REFERENCES "public"."Preventive"("id") ON DELETE CASCADE ON UPDATE CASCADE;
