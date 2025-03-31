import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import { db } from "../../../lib/db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Метод не дозволено' });

  try {
    const token = req.cookies.auth;
    if (!token) return res.status(401).json({ message: 'Неавторизований доступ' });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET не задано" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
    const adminId = decoded.id;

    const [adminData] = await db.query<RowDataPacket[]>("SELECT role FROM StudentsList WHERE id = ?", [adminId]);
    if (adminData.length === 0) return res.status(404).json({ message: 'Користувача не знайдено' });

    const isAdmin = adminData[0].role === "admin";
    const { id, name, phone, email, password, availablecl } = req.body;

    const userIdToUpdate = isAdmin && id ? id : adminId;

    const [user] = await db.query<RowDataPacket[]>("SELECT * FROM StudentsList WHERE id = ?", [userIdToUpdate]);
    if (user.length === 0) return res.status(404).json({ message: "Користувача не знайдено" });

    let updates: string[] = [];
    let values: (string | number)[] = [];

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
    if (availablecl !== undefined) {
      updates.push("student_availablecl = student_availablecl + ?");
      values.push(availablecl);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "Немає даних для оновлення" });
    }

    const updateQuery = `UPDATE StudentsList SET ${updates.join(", ")} WHERE id = ?`;
    values.push(userIdToUpdate);

    await db.query(updateQuery, values);

    return res.status(200).json({ message: "Дані успішно оновлено" });
  } catch (error) {
    console.error("Помилка при оновленні користувача:", error);
    return res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
};
