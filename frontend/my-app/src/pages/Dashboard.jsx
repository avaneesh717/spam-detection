import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchContacts();
  }, [token, navigate]);

  const fetchContacts = async () => {
    try {
      const res = await api.get("/contacts", { headers: { Authorization: `Bearer ${token}` } });
      setContacts(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const addContact = async e => {
    e.preventDefault();
    await api.post("/contacts", newContact, { headers: { Authorization: `Bearer ${token}` } });
    setNewContact({ name: "", phone: "" });
    fetchContacts();
  };

  return (
    <div className="container page">
      <div className="card">
        <div className="page-header">
          <h2>Your Contacts</h2>
          <p>Manage your personal contacts list</p>
        </div>
        <form className="form" onSubmit={addContact}>
          <div className="row">
            <input
              className="input"
              name="name"
              placeholder="Name"
              value={newContact.name}
              onChange={e => setNewContact({ ...newContact, name: e.target.value })}
            />
            <input
              className="input"
              name="phone"
              placeholder="Phone"
              value={newContact.phone}
              onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
            />
            <button className="btn btn-primary" type="submit">Add</button>
          </div>
        </form>

        <ul className="list mt-4">
          {contacts.map(c => (
            <li className="list-item" key={c.id}>
              <span>{c.name} - {c.phone}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
