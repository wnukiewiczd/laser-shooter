import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";

export default function PlayPage({ sessionUser }) {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const navigate = useNavigate();

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

  const handleStartButton = (e) => {
    if (selectedPlayer) {
      navigate("/game", { state: { player: selectedPlayer } });
    } else {
      alert("Proszę wybrać gracza!");
      console.log(selectedPlayer);
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
        <h2 className="w-full text-3xl font-bold text-gray-800">
          Wybierz Gracza
        </h2>
        <div className="m-4">
          <select
            className="w-full px-4 py-2 text-gray-700 bg-blue-100 rounded-md focus:ring-2 focus:ring-blue-300"
            defaultValue=""
            onChange={(e) =>
              setSelectedPlayer(
                players.find((p) => p.id.toString() === e.target.value)
              )
            }
          >
            <option value="" disabled>
              Nazwa gracza
            </option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>
        <div className="m-4">
          <button
            className="w-full px-4 py-2 text-black bg-green-500 rounded-md hover:bg-green-400 focus:ring-2 focus:ring-green-300"
            onClick={handleStartButton}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
