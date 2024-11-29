import jwt from "jsonwebtoken";

const generateToken = (nama: string, role: string) => {
  const payload = { nama, role };
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

export default generateToken;
