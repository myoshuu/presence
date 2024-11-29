import { PrismaClient, Siswa } from "@prisma/client";
import data from "../data/data";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.create({
    data: {
      name: "admin",
      username: "admin",
      role: "admin",
      password: await bcrypt.hash("admin", 10),
    },
  });

  const guru = await prisma.guru.upsert({
    where: { nip: 69856 },
    update: {},
    create: {
      nip: 69856,
      nama: "Budi",
      alamat: "Jl. Jalan",
      no_hp: "08123456789",
      password: await bcrypt.hash("guru", 10),
    },
  });

  const kelas = await prisma.kelas.create({
    data: {
      nama: "XII RPL 1",
      guru_nip: guru.nip,
    },
  });

  const orangTuaIds: number[] = [];

  for (const o of data.dataOrangTua) {
    const orangTua = await prisma.orangTua.create({
      data: {
        nik: o.nik,
        nama: o.nama,
        alamat: o.alamat,
        no_hp: o.no_hp,
        password: await bcrypt.hash(o.nama.toLowerCase(), 10),
      },
    });
    orangTuaIds.push(orangTua.id);
  }

  let lastSiswa: Siswa | null = null;
  for (let i = 0; i < data.dataSiswa.length; i++) {
    const s = data.dataSiswa[i];

    lastSiswa = await prisma.siswa.upsert({
      where: { nis: s.nis },
      update: {},
      create: {
        nis: s.nis,
        nama: s.nama,
        alamat: s.alamat,
        no_hp: s.no_hp,
        orangTuaId: orangTuaIds[i],
        kelasId: kelas.id,
      },
    });
  }

  const list = await prisma.list.create({
    data: {
      nama: "Matematika Lanjutan",
      siswa_nis: lastSiswa!.nis,
    },
  });

  await prisma.task.create({
    data: {
      nama: "Tugas 1",
      deskripsi: "Mengerjakan halaman 15-20",
      deadline: new Date(),
      list_id: list.id,
    },
  });
};

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
