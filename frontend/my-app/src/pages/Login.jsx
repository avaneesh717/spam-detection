import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div className="container page">
      <div className="card">
        <div className="page-header">
          <h2>Login</h2>
          <p>Access your dashboard and manage your contacts</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input className="input" id="email" type="email" name="email" placeholder="you@example.com" onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input className="input" id="password" type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
          </div>
          <div className="row mt-3">
            <button className="btn btn-primary" type="submit">Login</button>
          </div>
        </form>
        {message && <p className="mt-3">{message}</p>}
        <p className="mt-3" style={{ textAlign: "center" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--primary)", textDecoration: "underline" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
