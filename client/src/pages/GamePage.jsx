import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import mqtt from "mqtt";

export default function GamePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(30);
  const { player } = location.state || null;

  const [client, setClient] = useState(null);
  const [clientStatus, setClientStatus] = useState("Disconnected");

  useEffect(() => {
    // Connect to the MQTT broker
    const client = mqtt.connect("mqtt://192.168.4.2:1883");

    // Subscribe to topics
    client.on("connect", () => {
      client.subscribe("application");
      setClientStatus("Connected");
    });

    client.on("error", (err) => {
      setClientStatus("Disconnect");
    });

    // Handle incoming messages
    client.on("message", (topic, message) => {
      const msg = message.toString();
      if (topic === "application" && msg === "target_hit") {
      }
    });

    setClient(client);

    // Cleanup on component unmount
    return () => {
      client.end();
    };
  }, []);

  const sendCommand = (command) => {
    if (client && clientStatus === "Connected") {
      client.publish("application", command);
    }
  };

  // const [client, setClient] = useState(null);
  // const mqttConnect = (host, mqttOption) => {
  //   setClient(mqtt.connect(host, mqttOption));
  // };
  // useEffect(() => {
  //   if (client) {
  //     console.log(client);
  //     client.on("connect", () => {
  //       setConnectStatus("Connected");
  //     });
  //     client.on("error", (err) => {
  //       console.error("Connection error: ", err);
  //       client.end();
  //     });
  //     client.on("reconnect", () => {
  //       setConnectStatus("Reconnecting");
  //     });
  //     client.on("message", (topic, message) => {
  //       const payload = { topic, message: message.toString() };
  //       setPayload(payload);
  //     });
  //   }
  // }, [client]);

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
