import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async e => {
    e.preventDefault();
    if (!token) {
      navigate("/");
      return;
    }
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/search?query=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data || []);
      if (res.data.length === 0) {
        setError("No results found. Try searching by name or phone number.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setError(err.response?.data?.error || "Search failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const markSpam = async phone => {
    if (!token) {
      navigate("/");
      return;
    }
    if (!confirm(`Mark ${phone} as spam?`)) return;
    try {
      await api.post("/spam", { phone }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Number marked as spam!");
      if (query.trim()) {
        const res = await api.get(`/search?query=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data || []);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        alert(err.response?.data?.message || "Failed to mark as spam");
      }
    }
  };

  return (
    <div className="container page">
      <div className="card">
        <div className="page-header">
          <h2>Search Global Database</h2>
          <p>Look up names or numbers; mark suspicious ones as spam</p>
        </div>
        <form className="form" onSubmit={search}>
          <div className="row">
            <input 
              className="input w-full" 
              value={query} 
              onChange={e => {
                setQuery(e.target.value);
                setError("");
              }} 
              placeholder="Search by name or phone number" 
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-3" style={{ color: "var(--danger)", fontWeight: "500" }}>
            {error}
          </p>
        )}

        {results.length > 0 && (
          <div className="mt-4">
            <p style={{ marginBottom: "12px", color: "var(--muted)" }}>
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            <ul className="list">
              {results.map((r, i) => (
                <li className="list-item" key={i}>
                  <span 
                    style={{ cursor: "pointer", flex: 1 }} 
                    onClick={() => navigate(`/person/${encodeURIComponent(r.phone)}`)}
                  >
                    <strong>{r.name || "Unknown"}</strong> - {r.phone}
                    {typeof r.spamLikelihood !== 'undefined' && r.spamLikelihood > 0 && (
                      <span style={{ color: "var(--danger)", marginLeft: "8px" }}>
                        (Spam: {(r.spamLikelihood * 100).toFixed(0)}%)
                      </span>
                    )}
                  </span>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => markSpam(r.phone)}
                    style={{ marginLeft: "10px" }}
                  >
                    Mark Spam
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.length === 0 && !loading && query && !error && (
          <p className="mt-4" style={{ color: "var(--muted)" }}>
            No results found. Try a different search term.
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;
