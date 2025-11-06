import Contact from "../models/Contact.js";

export const addContact = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    await Contact.create(userId, name, phone);
    res.json({ message: "Contact added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const contacts = await Contact.getByUser(userId);
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
