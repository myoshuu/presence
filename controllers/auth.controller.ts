import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import generateToken from "@/utils/jwt";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const qrLogin = async (req: NextApiRequest, res: NextApiResponse) => {
  const { nis, date } = req.body;

  try {
    const siswa = await prisma.siswa.findUnique({
      where: { nis },
      include: { Kelas: true },
    });

    if (!siswa)
      return res.status(404).json({ message: "Maaf, nis tidak terdaftar" });

    const namaSiswa = siswa.nama;
    const token = generateToken(namaSiswa, "siswa");

    const now = new Date();

    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const existAbsen = await prisma.laporanAbsensi.findFirst({
      where: {
        siswaId: siswa.nis,
        tanggal: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existAbsen)
      return res.status(200).json({
        isAbsen: true,
        token,
        siswa,
      });

    await prisma.laporanAbsensi.create({
      data: {
        siswaId: siswa.nis,
        kelasId: siswa.kelasId != null ? siswa.kelasId : 0,
        tanggal: new Date(date),
        waktuMasuk: now,
      },
    });

    return res.status(200).json({ isAbsen: false, token, siswa });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "System failure!" });
  }
};

export const loginGuru = async (req: NextApiRequest, res: NextApiResponse) => {
  const { nip, password } = req.body;

  try {
    const guru = await prisma.guru.findUnique({ where: { nip } });

    if (!guru)
      return res.status(404).json({ message: "Maaf, nip tidak terdaftar" });

    const isValid = bcrypt.compare(password, guru.password);
    if (!isValid)
      return res.status(404).json({ message: "Maaf, password salah" });

    const token = generateToken(guru.nama, "guru");
    return res.status(200).json({ token, guru });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "System failure!" });
  }
};

export const loginOrtu = async (req: NextApiRequest, res: NextApiResponse) => {
  const { nik, password } = req.body;

  try {
    const ortu = await prisma.orangTua.findUnique({ where: { nik } });
    if (!ortu)
      return res.status(404).json({ message: "Maaf, nik tidak terdaftar" });

    const isValid = bcrypt.compare(password, ortu.password);

    if (!isValid)
      return res.status(404).json({ message: "Maaf, password salah" });

    const token = generateToken(ortu.nama, "ortu");
    return res.status(200).json({ token, ortu });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "System failure!" });
  }
};

export const loginAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;

  try {
    const admin = await prisma.user.findUnique({ where: { username } });
    if (!admin)
      return res.status(404).json({ message: "Maaf, kamu bukan admin" });

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid)
      return res.status(404).json({ message: "Maaf, password salah" });

    const token = generateToken(admin.username, admin.role);
    return res.status(200).json({ token, admin });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "System failure!" });
  }
};
