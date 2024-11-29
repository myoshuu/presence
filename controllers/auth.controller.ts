import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const generateToken = (nama: string, role: string) => {
  const payload = { nama, role };
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

export const qrLogin = async (req: NextApiRequest, res: NextApiResponse) => {
  const nis = req.body;

  try {
    const siswa = await prisma.siswa.findUnique({ where: { nis } });

    if (!siswa)
      return res.status(404).json({ message: "Maaf, nis tidak terdaftar" });

    const token = generateToken(siswa.nama, "siswa");
    return res.status(200).json({ token, siswa });
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

    const isValid = bcrypt.compare(password, admin.password);

    if (!isValid)
      return res.status(404).json({ message: "Maaf, password salah" });

    const token = generateToken(admin.username, admin.role);
    return res.status(200).json({ token, admin });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "System failure!" });
  }
};
