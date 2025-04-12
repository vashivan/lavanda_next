import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: "srv1509.hstgr.io",
  user: procces.env.DB_USER,
  password: procces.env.DB_PASSWORD,
  database: "u709554459_schedule",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
