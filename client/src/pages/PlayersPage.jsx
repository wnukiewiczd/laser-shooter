import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";

export default function PlayersPage({ sessionUser }) {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");

  const fetchPlayers = async (userId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/getPlayers",
        {
          user_id: userId,
        },
        { withCredentials: true, credentials: "include" }
      );

      return response.data;
    } catch (error) {
      console.error(error.response || "Something went wrong");
      throw error;
    }
  };

  const addNewPlayerToDatabase = async (userId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/addPlayer",
        {
          user_id: userId,
          playerName: newPlayerName,
        },
        { withCredentials: true, credentials: "include" }
      );

      return response.data;
    } catch (error) {
      console.error(error.response || "Something went wrong");
      throw error;
    }
  };

  useEffect(() => {
    const loadPlayers = async () => {
      if (!sessionUser) {
        console.log("Session user is not set");
        return;
      }

      try {
        const playerData = await fetchPlayers(sessionUser.id);
        setPlayers(playerData);
      } catch (error) {
        console.error("Failed to load players", error);
      }
    };

    loadPlayers();
  }, [sessionUser]);

  const handleNewPlayerAdd = async () => {
    setNewPlayerName("");

    try {
      // Here add new player
      const addPlayerResponse = await addNewPlayerToDatabase(sessionUser.id);

      const updatedPlayers = await fetchPlayers(sessionUser.id);
      setPlayers(updatedPlayers);
    } catch (error) {
      console.error(
        "Failed to update players list after adding new player",
        error
      );
    }
  };

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
          <div className="w-full flex py-2 text-gray-700 rounded-md">
            <input
              type="addNewPlayer"
              id="addNewPlayer"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Nazwa nowego gracza"
              className="block w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleNewPlayerAdd}
              className="p-2 text-center bg-green-600 rounded-xl text-white mt-1 ml-4"
            >
              Dodaj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
