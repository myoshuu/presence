-- CreateTable
CREATE TABLE `LaporanAbsensi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `siswaId` INTEGER NOT NULL,
    `kelasId` INTEGER NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `waktuMasuk` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LaporanAbsensi` ADD CONSTRAINT `LaporanAbsensi_siswaId_fkey` FOREIGN KEY (`siswaId`) REFERENCES `Siswa`(`nis`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanAbsensi` ADD CONSTRAINT `LaporanAbsensi_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `Kelas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
