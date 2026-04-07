-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareExpires" TIMESTAMP(3);
