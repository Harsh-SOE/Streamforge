-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "avatar" SET DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFEG18PvoiXjWsEEMEkb_QfJJSNP29O-Ef0gog_eimS8vFG1NR_DXq28BTSmT2KLUd0C4&usqp=CAU';

-- CreateIndex
CREATE INDEX "User_authUserId_handle_idx" ON "public"."User"("authUserId", "handle");
