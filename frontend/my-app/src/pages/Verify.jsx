import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    email: location.state?.email || "", 
    otp: location.state?.otp || "" 
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state?.email) {
      setForm(prev => ({ ...prev, email: location.state.email }));
    }
    if (location.state?.otp) {
      setForm(prev => ({ ...prev, otp: location.state.otp }));
    }
  }, [location.state]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/verify", form);
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="container page">
      <div className="card">
        <div className="page-header">
          <h2>Verify your account</h2>
          <p>{location.state?.otp ? "Enter the OTP shown on the previous page" : "Enter the OTP sent to your email to complete registration"}</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input className="input" id="email" type="email" name="email" value={form.email} placeholder="you@example.com" onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="label" htmlFor="otp">OTP</label>
            <input className="input" id="otp" type="text" name="otp" value={form.otp} placeholder="6-digit code" onChange={handleChange} required />
          </div>
          <div className="row mt-3">
            <button className="btn btn-primary" type="submit">Verify</button>
          </div>
        </form>
        {message && (
          <p className="mt-3" style={{ 
            color: message.includes("successfully") ? "var(--accent)" : "var(--danger)",
            fontWeight: "500"
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Verify;
