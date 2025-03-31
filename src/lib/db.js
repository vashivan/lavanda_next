import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: "srv1509.hstgr.io",
  user: "u709554459_lavanda",
  password: "lavandaDATA1",
  database: "u709554459_schedule",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
