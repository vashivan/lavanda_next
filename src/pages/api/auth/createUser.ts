import bcrypt from "bcryptjs";
import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Метод не дозволено" });

  const { name, phone, email, password, role } = req.body;
  if (!name || !phone || !email || !password || !role) {
    return res.status(400).json({ error: "Заповніть всі поля" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET не знайдено");
    return res.status(500).json({ error: "Помилка сервера" });
  }

  try {
    // Перевіряємо токен (адмін чи ні)
    const token = req.cookies.auth;
    if (!token) return res.status(401).json({ error: "Немає авторизації" });

    const decoded = jwt.verify(token, secret);
    if (typeof decoded !== "object" || decoded.role !== "admin") {
      return res.status(403).json({ error: "Недостатньо прав" });
    }

    // Перевірка, чи є вже користувач із таким email
    const [existingUsers] = await db.query("SELECT id FROM StudentsList WHERE student_email = ?", [email]);
    if ((existingUsers as any[]).length > 0) {
      return res.status(400).json({ error: "Користувач уже існує" });
    }

    // Хешуємо пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Додаємо клієнта в базу
    await db.query(
      "INSERT INTO StudentsList (student_name, student_phone, student_email, student_password, student_availablecl, role) VALUES (?, ?, ?, ?, ?, ?)",
      [name, phone, email, hashedPassword, 0, role]
    );

    res.status(201).json({ message: "Клієнта зареєстровано" });
  } catch (error) {
    console.error("Помилка:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
}
