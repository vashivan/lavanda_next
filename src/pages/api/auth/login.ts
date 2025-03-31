import bcrypt from "bcryptjs";
import { db } from "../../../lib/db";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { RowDataPacket } from "mysql2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Метод не дозволено" });

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Введіть email та пароль" });
  }

  try {
    // Шукаємо користувача в БД
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, student_name, student_availablecl, student_email, student_phone, student_password, role FROM StudentsList WHERE student_email = ?",
      [email]
    );
    const user = rows[0];
    // console.log("🛠️ Запит у базу даних...");
    // console.log("Email:", email);
    // console.log("Password (чистий текст):", password);
    // console.log("Отримані дані з БД:", rows);

    if (!user) {
      return res.status(401).json({ error: "Неправильний email або пароль" });
    }

    // Перевіряємо пароль
    const isMatch = await bcrypt.compare(password, user.student_password);
    if (!isMatch) {
      return res.status(401).json({ error: "Неправильний email або пароль" });
    }
    // Генеруємо токен
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET не заданий у .env");
      return res.status(500).json({ error: "Помилка сервера" });
    }

    const token = jwt.sign({ 
      id: user.id,
      name: user.student_name, 
      email: user.student_email,
      phone: user.student_phone,
      availablecl: user.student_availablecl,
      role: user.role,
    }, secret, { expiresIn: "7d" });

    // Записуємо токен в HTTP-only cookie
    res.setHeader(
      "Set-Cookie",
      serialize("auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 днів
      })
    );

    res.json({ message: "Успішний вхід" });
  } catch (error) {
    console.error("Помилка логіну:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
}
