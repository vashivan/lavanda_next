import { db } from "../../lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { RowDataPacket } from "mysql2/promise";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (typeof req.body === "string") {
    req.body = JSON.parse(req.body);
  }
  const { name, email, phone, studio, className, classId, classTime } = req.body;
  if (!name) return res.status(400).json({ message: "Missing name" });
  if (!email) return res.status(400).json({ message: "Missing email" });
  if (!phone) return res.status(400).json({ message: "Missing phone" });
  if (!studio) return res.status(400).json({ message: "Missing studio" });
  if (!className) return res.status(400).json({ message: "Missing className" });
  if (!classId) return res.status(400).json({ message: "Missing classId" });
  if (!classTime) return res.status(400).json({ message: "Missing classTime" });

  console.log("📩 Received body:", req.body);


  try {
    // Виконуємо SELECT і перевіряємо, що є результати
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT class_name, start_time, available_spots FROM Schedule WHERE id = ?",
      [classId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Class not found" });
    }

    const { class_name, start_time, available_spots } = rows[0];

    if (available_spots <= 0) {
      return res.status(400).json({ message: "No available spots" });
    }

    // Перевіряємо баланс занять у студента
    const [studentRows] = await db.query<RowDataPacket[]>(
      "SELECT student_availablecl FROM StudentsList WHERE student_phone = ?",
      [phone]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { student_availablecl } = studentRows[0];

    if (student_availablecl <= 0) {
      return res.status(400).json({ message: "No available class balance" });
    }

    // Оновлюємо кількість місць
    await db.query("UPDATE Schedule SET available_spots = available_spots - 1 WHERE id = ?", [classId]);
    await db.query("UPDATE StudentsList SET student_availablecl = student_availablecl - 1 WHERE student_phone = ?", [phone]);

    const newBalance = student_availablecl - 1;

    // Створюємо транспортер для надсилання пошти
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD,
      }
    });

    const studioName = (studioName: string) => {
      if (studioName === "lavanda_red") {
        return "Lavanda Red";
      } else {
        return "Lavanda Purple";
      }
    };

    const studioAddress = (studioName: string) => {
      if (studioName === "lavanda_red") {
        return "м. Бровари, вул. Соборна 21";
      } else {
        return "м. Бровари, вул. Київська 261-а (ЖК 'Діамант')";
      }
    };

    const studioFullName = studioName(studio);
    const studioFullAddress = studioAddress(studio);
    const isLavandaRed = studio === "lavanda_red";
    const titleColor = isLavandaRed ? "rgb(189, 6, 6)" : "#4C266A";

    const mailOptions = {
      from: `"Lavanda Studio" <${process.env.MAILER_USER}>`,
      to: process.env.MAILER_LAVANDA,
      subject: "Новий запис на заняття",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
      <h3 style="font-size: 16px; line-height: 1.5; color: #333; text-align: center;">
       Новий запис на заняття у студії <strong style="color:  ${titleColor};">${studioName(studio)}</strong>.
      </h3>
      <div style="background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); margin-top: 15px;">
        <p><strong>Клієнт:</strong> ${name}</p>
        <p><strong>Заняття:</strong> ${class_name}</p>
        <p><strong>Дата та час:</strong> ${new Date(start_time).toLocaleString("uk-UA")}</p>
        <p><strong>Студія:</strong> ${studioFullName}</p>
        <p><strong>Баланс занять клієнта:</strong> ${newBalance}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Електронна пошта:</strong> ${email}</p>
      </div>
    </div>
      `,
    };

    const mailOptionsClient = {
      from: `"Lavanda Studio" <${process.env.MAILER_USER}>`,
      to: `${email}`,
      subject: "Підтвердження запису на заняття",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: ${titleColor}; text-align: center;">Вітаємо, ${name}!</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #333; text-align: center;">
            Ви успішно записалися на заняття у студії <strong style="color:  ${titleColor};">${studioName(studio)}</strong>.
          </p>
          <div style="background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); margin-top: 15px;">
            <p><strong>🧘 Заняття:</strong> ${class_name}</p>
            <p><strong>📅 Дата та час:</strong> ${new Date(start_time).toLocaleString("uk-UA")}</p>
            <p><strong>📍 Адреса студії:</strong> ${studioFullAddress}</p>
            <p><strong>💳 Баланс занять:</strong> ${newBalance}</p>
          </div>
          <p style="margin-top: 20px; font-size: 14px; text-align: center; color: #666;">
            Якщо у вас виникли запитання або ви хочете змінити запис, зв’яжіться з нами.
          </p>
          <p style="text-align: center; margin-top: 20px; font-weight: bold; color: ${titleColor};">
            З найкращими побажаннями,<br>
            <strong>${studioName(studio)}</strong>
          </p>
        </div>
      `,
    };


    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOptionsClient);

    res.status(200).json({ message: "Booking successful", classId });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server error", error: error instanceof Error ? error.message : error });
  }
}
