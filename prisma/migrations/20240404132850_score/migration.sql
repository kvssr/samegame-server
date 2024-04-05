/*
  Warnings:

  - Added the required column `score` to the `Highscore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Highscore" ADD COLUMN     "score" INTEGER NOT NULL;
