import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

const Register = () => {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "", city: "", country: ""
  });
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setOtp("");
    try {
      const res = await api.post("/auth/register", form);
      setMessage(res.data.message);
      if (res.data.otp) {
        setOtp(res.data.otp);
      }
      setTimeout(() => {
        navigate("/verify", { state: { email: form.email, otp: res.data.otp || null } });
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Registration failed";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="container page">
      <div className="card">
        <div className="page-header">
          <h2>Create your account</h2>
          <p>Join to track contacts and report spam numbers</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          {["name", "phone", "email", "password", "city", "country"].map(field => (
            <div className="field" key={field}>
              <label className="label" htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                className="input"
                id={field}
                type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                name={field}
                placeholder={field === "email" ? "you@example.com" : field === "phone" ? "+1 555 123 4567" : field.charAt(0).toUpperCase() + field.slice(1)}
                onChange={handleChange}
                required={["city", "country"].includes(field) ? false : true}
              />
            </div>
          ))}
          <div className="row mt-3">
            <button className="btn btn-primary" type="submit">Register</button>
          </div>
        </form>
        {message && (
          <div className="mt-3">
            <p style={{ 
              color: message.includes("successfully") ? "var(--accent)" : "var(--danger)",
              fontWeight: "500"
            }}>
              {message}
            </p>
            {otp && (
              <div style={{ 
                marginTop: "12px", 
                padding: "12px", 
                background: "var(--card)", 
                border: "1px solid var(--border)", 
                borderRadius: "8px" 
              }}>
                <p style={{ marginBottom: "8px", fontWeight: "600" }}>Your OTP (for development):</p>
                <p style={{ 
                  fontSize: "1.5rem", 
                  fontWeight: "700", 
                  color: "var(--accent)", 
                  letterSpacing: "4px",
                  fontFamily: "monospace"
                }}>
                  {otp}
                </p>
              </div>
            )}
            {message.includes("Email already exists") && (
              <p style={{ marginTop: "8px" }}>
                <Link to="/" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                  Click here to login instead
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
