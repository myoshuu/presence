/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `OrangTua` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `OrangTua_nik_key` ON `OrangTua`(`nik`);
