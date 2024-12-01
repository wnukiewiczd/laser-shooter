import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

export default function GamePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(30);
  const { player } = location.state || null;

  useEffect(() => {
    if (!player) {
      navigate("play");
    }
  }, [player, navigate]);

  useEffect(() => {
    if (remainingTime <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  const handleEndGameButton = () => {
    navigate("/play");
  };

  return (
    <div className="flex w-full h-dvh flex-col items-center min-h-screen bg-blue-400">
      <button
        className="w-full px-4 py-2 text-white bg-red-500 hover:bg-red-400 focus:ring-2 focus:ring-red-300"
        onClick={handleEndGameButton}
      >
        Zakończ grę
      </button>
      <div
        id="gameContainer"
        className="flex flex-col space-y-12 items-center justify-center w-full h-full"
      >
        <h2 className="text-3xl font-bold text-gray-800">
          Gra gracza {player.name}
        </h2>
        <div
          id="gameInfo"
          className="p-12 rounded-lg bg-gray-700 flex justify-center items-center font-semibold text-white"
        >
          <h3>Traf w cel!</h3>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          Pozostały czas: {remainingTime}s
        </h2>
      </div>
    </div>
  );
}
