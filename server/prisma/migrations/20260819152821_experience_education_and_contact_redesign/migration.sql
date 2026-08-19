/*
  Warnings:

  - You are about to drop the column `email` on the `ContactMessage` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `ContactMessage` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ContactMessage` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContactPurpose" AS ENUM ('HIRE', 'CONSULT');

-- AlterEnum
ALTER TYPE "SkillCategory" ADD VALUE 'DATABASE';

-- AlterTable
ALTER TABLE "ContactMessage" DROP COLUMN "email",
DROP COLUMN "message",
DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "purpose" "ContactPurpose" NOT NULL;

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "period" TEXT NOT NULL,
    "bullets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "period" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);
