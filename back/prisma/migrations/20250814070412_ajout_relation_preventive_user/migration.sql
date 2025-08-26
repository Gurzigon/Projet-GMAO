-- CreateTable
CREATE TABLE "public"."UserPreventive" (
    "id" SERIAL NOT NULL,
    "preventiveId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserPreventive_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserPreventive" ADD CONSTRAINT "UserPreventive_preventiveId_fkey" FOREIGN KEY ("preventiveId") REFERENCES "public"."Preventive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPreventive" ADD CONSTRAINT "UserPreventive_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
