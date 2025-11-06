import Spam from "../models/Spam.js";

export const markSpam = async (req, res) => {
  try {
    const { phone } = req.body;
    const userId = req.user.id;

    await Spam.mark(phone, userId);
    res.json({ message: "Number marked as spam" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSpamLikelihood = async (req, res) => {
  try {
    const data = await Spam.getSpamStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
