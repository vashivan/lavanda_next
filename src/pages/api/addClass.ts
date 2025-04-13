import { start } from "repl";
import { db } from "../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Метод не дозволено" });

  const { classTitle, startTime, selectedStudio, instructor, spots } = req.body;
  if (!classTitle || !startTime || !selectedStudio || !instructor || spots === null || spots === undefined) {
    return res.status(400).json({ error: "Заповніть всі поля" });
  }

  try {
    await db.query(
      "INSERT INTO Schedule (studio, class_name, start_time, instructor, max_spots, available_spots) VALUES (?, ?, ?, ?, ?, ?)",
      [selectedStudio, classTitle, startTime, instructor, spots, spots]
    );

    res.status(201).json({ message: "Заняття додано" });
  } catch (error) {
    console.error("Помилка:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
}

