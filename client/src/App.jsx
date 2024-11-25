import React, { useEffect } from "react";
import axios from "axios";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/check-session", {
        withCredentials: true,
        credentials: "include",
      })
      .then((response) => {})
      .catch((error) => {
        if (error.response.status === 401) {
          navigate("/login");
        }
      });
  }, [navigate]);

  return (
    <Routes>
      <Route path="*" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
