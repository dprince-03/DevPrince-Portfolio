-- CreateEnum
CREATE TYPE "ContactChannel" AS ENUM ('WHATSAPP', 'EMAIL');

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "channel" "ContactChannel" NOT NULL DEFAULT 'WHATSAPP',
ADD COLUMN     "email" TEXT,
ALTER COLUMN "phone" DROP NOT NULL;
