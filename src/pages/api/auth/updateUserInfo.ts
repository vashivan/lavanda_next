import bcrypt from "bcryptjs";
import { db } from "../../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Метод не дозволено' });

  try {
    const  token  = req.cookies.auth; // Отримуємо токен із cookies
    if (!token) return res.status(401).json({ error: 'Неавторизований доступ' });

    // Розшифровуємо токен і отримуємо ID користувача
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    const userId = decoded.id;

    const { name, phone, email, password } = req.body;

    // Перевіряємо, чи користувач існує
    const [users] = await db.query<RowDataPacket[]>("SELECT * FROM StudentsList WHERE id = ?", [userId]);
    if (users.length === 0) return res.status(404).json({ error: "Користувача не знайдено" });

    // Формуємо запит на оновлення
    let updateQuery = "UPDATE StudentsList SET";
    let values: (string | number)[] = [];
    let updates: string[] = [];

    if (name) {
      updates.push("student_name = ?");
      values.push(name);
    }
    if (phone) {
      updates.push("student_phone = ?");
      values.push(phone);
    }
    if (email) {
      updates.push("student_email = ?");
      values.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push("student_password = ?");
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "Немає даних для оновлення" });
    }

    updateQuery += " " + updates.join(", ") + " WHERE id = ?";
    values.push(userId);

    await db.query(updateQuery, values);

    return res.status(200).json({ message: "Дані успішно оновлено" });

  } catch (error) {
    console.error("Помилка при оновленні користувача:", error);
    return res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};
