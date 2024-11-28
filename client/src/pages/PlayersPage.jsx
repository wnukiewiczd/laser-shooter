import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

export default function PlayersPage({ sessionUser }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionUser) {
        console.log("Session user is not set");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/getPlayers",
          {
            user_id: sessionUser.id,
          },
          { withCredentials: true, credentials: "include" }
        );

        setPlayers(response.data);
      } catch (error) {
        console.error(error.response || "Something went wrong");
      }
    };

    fetchData();
  }, [sessionUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-blue-400 rounded-lg shadow-md flex flex-col text-center">
        <Link
          to="\dashboard"
          className="w-100 p-2 bg-blue-400 rounded-tl-lg rounded-tr-lg hover:bg-blue-300 focus:ring-4 focus:ring-blue-300"
        >
          Wróć
        </Link>
        <h2 className="w-full text-3xl font-bold text-gray-800">Gracze</h2>
        <div className="space-y-4 m-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="w-full px-4 py-2 text-gray-700 bg-blue-100 rounded-md"
            >
              {player.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
