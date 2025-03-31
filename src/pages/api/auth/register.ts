import bcrypt from "bcryptjs";
import { db } from "../../../lib/db";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { RowDataPacket } from "mysql2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Метод не дозволено" });

  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ error: "Введіть ім'я, телефон, email та пароль" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET не заданий у .env");
    return res.status(500).json({ error: "Помилка сервера" });
  }

  try {
    // Перевіряємо, чи користувач вже існує
    const [existingUsers] = await db.query<RowDataPacket[]>(
      "SELECT id FROM StudentsList WHERE student_email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Користувач з таким email вже існує" });
    }

    // Хешуємо пароль перед збереженням
    const hashedPassword = await bcrypt.hash(password, 10);

    // Додаємо користувача в базу
    const [result] = await db.query(
      "INSERT INTO StudentsList (student_name, student_phone, student_email, student_password, student_availablecl) VALUES (?, ?, ?, ?, ?)",
      [name, phone, email, hashedPassword, 0] // `0` для доступних занять
    );

    // Отримуємо ID нового користувача
    const userId = (result as any).insertId;

    // Отримуємо його дані
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, student_name, student_phone, student_email, student_availablecl FROM StudentsList WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(500).json({ error: "Помилка отримання даних користувача" });
    }

    const user = rows[0];

    // Генеруємо JWT токен
    const token = jwt.sign(
      {
        id: user.id,
        name: user.student_name,
        email: user.student_email,
        phone: user.student_phone,
        availablecl: user.student_availablecl,
      },
      secret,
      { expiresIn: "7d" }
    );

    // Встановлюємо токен в HTTP-only кукі
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

    res.status(201).json({ message: "Реєстрація успішна", user });
  } catch (error) {
    console.error("Помилка реєстрації:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
}

