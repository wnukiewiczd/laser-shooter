import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [initialSettings, setInitialSettings] = useState({});
  const [selectedAudioEnabled, setSelectedAudioEnabled] = useState(true);
  const [selectedTargetColor, setSelectedTargetColor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsResponse = await axios.post(
          `http://localhost:5000/getUserSettings`,
          {},
          {
            withCredentials: true,
            credentials: "include",
          }
        );

        if (settingsResponse) {
          const { sound_enabled, target_color } =
            settingsResponse.data.settings;
          setSelectedAudioEnabled(sound_enabled);
          setSelectedTargetColor(target_color);
          setInitialSettings(settingsResponse.data.settings);
        }
      } catch (err) {
        if (err.response.status === 500) {
          navigate("/dashboard");
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updateResponse = await axios.post(
        "http://localhost:5000/updateUserSettings",
        {
          sound_enabled: selectedAudioEnabled,
          target_color: selectedTargetColor,
        },
        {
          withCredentials: true,
          credentials: "include",
        }
      );
      console.log(updateResponse.data?.message);
    } catch (error) {
      console.error("Error submitting form:", error);
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
        <h2 className="w-full text-3xl font-bold text-gray-800">Ustawienia</h2>
        <form onSubmit={handleSubmit} className="space-y-4 m-4">
          <div className="flex justify-between items-center">
            <label
              htmlFor="sound_enabled"
              className="text-lg font-medium text-gray-800"
            >
              Włącz dźwięk
            </label>
            <input
              type="checkbox"
              name="sound_enabled"
              id="sound_enabled"
              checked={selectedAudioEnabled}
              onChange={(e) => setSelectedAudioEnabled(e.target.checked)}
              className="mr-2 scale-150"
            />
          </div>
          {/* <div className="flex justify-between items-center">
            <label
              htmlFor="username"
              className="mb-2 text-lg font-medium text-gray-800"
            >
              Kolor celu
            </label>
            <select
              className="px-4 py-2 text-gray-700 bg-blue-100 rounded-md focus:ring-2 focus:ring-blue-300"
              value={selectedTargetColor}
              onChange={(e) => setSelectedTargetColor(e.target.value)}
            >
              <option value="#00FF00">Zielony</option>
              <option value="#0000FF">Niebieski</option>
            </select>
          </div> */}
          <button
            type="submit"
            className="w-full p-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
          >
            Zapisz
          </button>
        </form>
      </div>
    </div>
  );
}
