import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import PlayersPage from "./pages/PlayersPage";
import SettingsPage from "./pages/SettingsPage";
import PlayPage from "./pages/PlayPage";
import GamePage from "./pages/GamePage";
import ScoreboardPage from "./pages/ScoreboardPage";

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

      <Route path="/play" element={<PlayPage sessionUser={sessionUser} />} />
      <Route path="/game" element={<GamePage sessionUser={sessionUser} />} />

      <Route
        path="/players"
        element={<PlayersPage sessionUser={sessionUser} />}
      />

      <Route
        path="/settings"
        element={<SettingsPage sessionUser={sessionUser} />}
      />

      <Route
        path="/scoreboard"
        element={<ScoreboardPage sessionUser={sessionUser} />}
      />
    </Routes>
  );
}

export default App;
