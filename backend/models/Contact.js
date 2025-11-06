import pool from "../config/db.js";

const Contact = {
  create: async (userId, name, phone) => {
    await pool.query(
      "INSERT INTO contacts (user_id, name, phone) VALUES (?, ?, ?)",
      [userId, name, phone]
    );
  },

  getByUser: async (userId) => {
    const [rows] = await pool.query("SELECT * FROM contacts WHERE user_id = ?", [userId]);
    return rows;
  },

  getAll: async () => {
    const [rows] = await pool.query("SELECT name, phone FROM contacts");
    return rows;
  }
};

Contact.hasPhone = async (userId, phone) => {
  const [rows] = await pool.query(
    "SELECT 1 FROM contacts WHERE user_id = ? AND phone = ? LIMIT 1",
    [userId, phone]
  );
  return rows.length > 0;
};

export default Contact;
