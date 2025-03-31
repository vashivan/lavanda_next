import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM Schedule");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Database Error:", error);

    if (error instanceof Error) {
      res.status(500).json({ message: "Error retrieving schedule", error: error.message });
    }
  }
};
