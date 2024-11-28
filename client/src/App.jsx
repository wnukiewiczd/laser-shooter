import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import PlayersPage from "./pages/PlayersPage";

function App() {
  const navigate = useNavigate();
  const [sessionUser, setSessionUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("http://localhost:5000/check-session", {
          withCredentials: true,
          credentials: "include",
        });

        const sessionUserResponse = await axios.get(
          `http://localhost:5000/getSessionUser`,
          {
            withCredentials: true,
            credentials: "include",
          }
        );
        setSessionUser(sessionUserResponse.data.user);
      } catch (err) {
        if (err.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <Routes>
      <Route path="*" element={<LoginPage sessionUser={sessionUser} />} />
      <Route
        path="/dashboard"
        element={<DashboardPage sessionUser={sessionUser} />}
      />
      <Route path="/login" element={<LoginPage />} sessionUser={sessionUser} />
      <Route
        path="/players"
        element={<PlayersPage sessionUser={sessionUser} />}
      />
    </Routes>
  );
}

export default App;
