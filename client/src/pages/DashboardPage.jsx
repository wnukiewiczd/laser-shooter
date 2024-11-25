import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true, credentials: "include" }
      );

      setLoading(false);
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      setLoading(false);
      console.error(error.response || "Something went wrong");
    }
  };

  const tabs = [
    { id: 1, name: "Graj", onClick: () => alert("Dashboard clicked") },
    { id: 2, name: "Ustawienia", onClick: () => alert("Settings clicked") },
    {
      id: 3,
      name: "Zarządzaj profilami",
      onClick: () => alert("Settings clicked"),
    },
    {
      id: 4,
      name: "Statystyki",
      onClick: () => alert("Notifications clicked"),
    },
    { id: 5, name: "Wyloguj się", onClick: handleLogout },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-blue-400 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Point Tag
        </h2>
        <div className="space-y-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={tab.onClick}
              className="w-full px-4 py-2 text-gray-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:ring-4 focus:ring-blue-300"
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
