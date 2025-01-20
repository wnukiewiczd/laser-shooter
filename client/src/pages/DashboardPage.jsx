import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Link } from "react-router";

const DashboardPage = ({ sessionUser }) => {
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
    {
      id: 1,
      name: "Graj",
      linkTo: "/play",
    },
    {
      id: 2,
      name: "Ustawienia",
      linkTo: "/settings",
    },
    {
      id: 3,
      name: "Lista graczy",
      linkTo: "/players",
    },
    {
      id: 4,
      name: "Statystyki",
      linkTo: "/scoreboard",
    },
    { id: 5, name: "Wyloguj się", onClick: handleLogout },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-blue-400 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Point Tag
        </h2>
        <div className="space-y-4 flex flex-col">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.linkTo}
              className="w-full text-center px-4 py-2 text-gray-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:ring-4 focus:ring-blue-300"
              onClick={tab.onClick}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
