import User from "../models/User.js";
import Contact from "../models/Contact.js";
import Spam from "../models/Spam.js";

export const search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Query is required" });
    }

    const users = await User.getAll();
    const contacts = await Contact.getAll();
    
    const global = [];
    
    users.forEach(user => {
      if (user.name && user.phone) {
        global.push({ name: user.name, phone: user.phone, source: 'user' });
      }
    });
    
  
    contacts.forEach(contact => {
      if (contact.name && contact.phone) {
        global.push({ name: contact.name, phone: contact.phone, source: 'contact' });
      }
    });

    const searchTerm = query.toLowerCase().trim();
    const results = global.filter(entry => {
      const nameMatch = entry.name && entry.name.toLowerCase().includes(searchTerm);
      const phoneMatch = entry.phone && entry.phone.includes(query);
      return nameMatch || phoneMatch;
    });

    const totalUsers = await User.getCount();
    for (let result of results) {
      const spamCount = await Spam.getSpamCountByPhone(result.phone);
      const likelihood = totalUsers > 0 ? spamCount / totalUsers : 0;
      result.spamLikelihood = likelihood; 
    }

    
    results.sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(searchTerm);
      const bStarts = b.name.toLowerCase().startsWith(searchTerm);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    });

    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getPerson = async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ message: "phone is required" });

    const person = await User.findByPhone(phone);

    const totalUsers = await User.getCount();
    const spamCount = await Spam.getSpamCountByPhone(phone);
    const spamLikelihood = totalUsers > 0 ? spamCount / totalUsers : 0;

    let email;
    if (person) {
      
      const requester = await User.findById(req.user.id);
      const inContacts = await Contact.hasPhone(person.id, requester.phone);
      if (inContacts) email = person.email;
    }

    res.json({
      name: person?.name || null,
      phone,
      spamLikelihood,
      email: email || null,
      isRegistered: Boolean(person)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
