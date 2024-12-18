import { NextApiRequest, NextApiResponse } from "next";
import { loginAdmin } from "@/controllers/auth.controller";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    await loginAdmin(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
