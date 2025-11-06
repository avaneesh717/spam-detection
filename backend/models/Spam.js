import pool from "../config/db.js";

const Spam = {
  mark: async (phone, userId) => {
    await pool.query("INSERT INTO spam (phone, marked_by) VALUES (?, ?)", [phone, userId]);
  },

  getSpamStats: async () => {
    const [rows] = await pool.query(`
      SELECT phone, COUNT(phone) AS spam_count
      FROM spam
      GROUP BY phone
    `);
    return rows;
  },

  getSpamCountByPhone: async (phone) => {
    const [rows] = await pool.query("SELECT COUNT(*) AS count FROM spam WHERE phone = ?", [phone]);
    return rows[0].count;
  }
};

export default Spam;
