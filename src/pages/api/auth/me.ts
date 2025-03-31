import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.auth;
    if (!token) return res.status(401).json({ error: "Не авторизований" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { 
      id: string; 
      student_name: string; 
      student_email: string; 
      student_phone: string;
      student_availablecl: number};
    
    res.json({ user: decoded });
  } catch (error) {
    res.status(401).json({ error: "Не авторизований" });
  }
}
