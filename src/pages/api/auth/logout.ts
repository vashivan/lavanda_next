import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Метод не дозволено" });

  res.setHeader(
    "Set-Cookie",
    serialize("auth", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0, // 7 днів
    })
  );
  res.json({ message: "Вихід успішний"})
};