import bcrypt from "bcryptjs";
import { db } from "../../../lib/db"; // Замініть шлях на свій
import { RowDataPacket } from "mysql2";

async function updatePasswords() {
  try {
    // Отримуємо список користувачів
    const [rows] = await db.query<RowDataPacket[]>("SELECT id, student_password FROM StudentsList");

    for (let user of rows) {
      const hashedPassword = await bcrypt.hash(user.student_password, 10);
      await db.query("UPDATE StudentsList SET student_password = ? WHERE id = ?", [hashedPassword, user.id]);
      console.log(`✅ Пароль оновлено для ID: ${user.id}`);
    }

    console.log("🎉 Всі паролі оновлено!");
  } catch (error) {
    console.error("❌ Помилка оновлення паролів:", error);
  }
}

updatePasswords();
