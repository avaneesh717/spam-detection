import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const PersonDetail = () => {
  const { phone } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    async function fetchData() {
      try {
        const res = await api.get(`/search/person?phone=${encodeURIComponent(phone)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (e) {
        if (e.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setError(e.response?.data?.message || e.message);
        }
      }
    }
    fetchData();
  }, [phone, token, navigate]);

  return (
    <div className="container page">
      <div className="card">
        <div className="page-header">
          <h2>Person Details</h2>
          <p>Aggregated information from the global database</p>
        </div>
        {error && <p className="mt-3">{error}</p>}
        {data && (
          <div className="stack mt-3">
            <div><strong>Name:</strong> {data.name || "Unknown"}</div>
            <div><strong>Phone:</strong> {data.phone}</div>
            <div><strong>Spam Likelihood:</strong> {(data.spamLikelihood * 100).toFixed(0)}%</div>
            {data.email && <div><strong>Email:</strong> {data.email}</div>}
            <div><strong>Registered User:</strong> {data.isRegistered ? "Yes" : "No"}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonDetail;


