import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const User = {
  create: async (userData) => {
    const { name, phone, email, password, city, country, otp } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (name, phone, email, password, city, country, otp, verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, email, hashedPassword, city || null, country || null, otp, false]
    );
  },

  findByEmail: async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },

  verifyOtp: async (email, otp) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return false;
    const user = rows[0];
    if (user.otp === otp) {
      await pool.query("UPDATE users SET verified = ?, otp = ? WHERE email = ?", [true, null, email]);
      return true;
    }
    return false;
  },

  comparePassword: async (entered, hashed) => {
    return await bcrypt.compare(entered, hashed);
  },

  getAll: async () => {
    const [rows] = await pool.query("SELECT name, phone, email FROM users");
    return rows;
  }
};

User.getCount = async () => {
  const [rows] = await pool.query("SELECT COUNT(*) AS count FROM users");
  return rows[0].count;
};

User.findByPhone = async (phone) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE phone = ?", [phone]);
  return rows[0];
};

User.findById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

export default User;
