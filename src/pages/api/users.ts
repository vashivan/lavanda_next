import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../lib/db"; // Переконайся, що шлях до `db.ts` правильний
import { RowDataPacket } from "mysql2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Метод не дозволено" });
  }

  try {
    // Отримуємо всіх користувачів з таблиці StudentsList
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, student_name, student_email, student_phone, student_availablecl, role FROM StudentsList"
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Помилка отримання користувачів:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
}
