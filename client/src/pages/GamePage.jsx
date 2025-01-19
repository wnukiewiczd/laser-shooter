import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import mqtt from "mqtt";

export default function GamePage() {
  // const MQTT_SERVER_OPTIONS = {
  //   clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
  //   username: "admin",
  //   password: "Admin123",
  //   clean: true,
  // };
  const MQTT_SERVER_HOST = "mqtt://192.168.4.2:1883";
  const MQTT_SERVER_OPTIONS = {
    clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
    clean: true,
  };
  const ROUND_TIME = 5;
  const PRE_ROUND_TIME = 5;
  const DRIVING_ROBOT_START_TIME_BEFORE_END = 20;
  const TARGET_TIMEOUT_DURATION = 3000;

  const location = useLocation();
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(ROUND_TIME);
  const [preRoundTime, setPreRoundTime] = useState(PRE_ROUND_TIME);
  const player = location?.state?.player || null;

  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState(null);

  const [currentHit, setCurrentHit] = useState(null);
  const [playerScore, setPlayerScore] = useState(null);
  const targetTimeoutRef = useRef(null);

  const mqttConnect = (host, mqttOption) => {
    setClient(mqtt.connect(host, mqttOption));
  };

  const mqttDisconnect = () => {
    if (client) {
      client.end(() => {
        setConnectStatus("Disconnected");
        console.log("Mqtt client disconnected");
      });
    }
  };

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        console.log(client);
        setConnectStatus("Connected");
        mqttSub({ topic: "raspberry/application/targetHit", qos: 1 });
        mqttSub({ topic: "raspberry/application/playerScore", qos: 1 });

        // Wyślij wiadomość o starcie gry do maliny
        mqttPublish({
          topic: "application/raspberry/gameStart",
          payload: "",
          qos: 1,
        });
      });
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        mqttDisconnect();
      });
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });
      client.on("message", (topic, message) => {
        const payload = { topic, message: message.toString() };
        mqttReceive(payload);
      });
    }
  }, [client]);

  const mqttSub = (subscription) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
      });
    }
  };

  const mqttPublish = (context) => {
    if (client) {
      const { topic, qos, payload } = context;
      client.publish(topic, payload, { qos }, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        }
      });
    }
  };

  const mqttReceive = ({ topic, message }) => {
    console.log(`Received! Topic: ${topic} Message: ${message}`);
    if (topic === "raspberry/application/targetHit") {
      if (["Wemos1", "Wemos2", "Wemos3"].includes(message)) {
        setCurrentHit(message);

        if (targetTimeoutRef.current) {
          clearTimeout(targetTimeoutRef.current);
        }

        targetTimeoutRef.current = setTimeout(() => {
          setCurrentHit(null);
          targetTimeoutRef.current = null;
        }, TARGET_TIMEOUT_DURATION);
      }
    } else if (topic === "raspberry/application/playerScore" && message) {
      mqttDisconnect();
      const score = parseInt(message);
      setPlayerScore(score);
      // Tutaj axios http post, zeby zapisac do bazy dane
      // Do Bazy na pewno idzie current player, czas gry, ile ustrzelił celów
    }
  };

  useEffect(() => {
    if (!player) {
      navigate("play");
    } else if (!client) {
      mqttConnect(MQTT_SERVER_HOST, MQTT_SERVER_OPTIONS);
    }
  }, [player, navigate]);

  useEffect(() => {
    if (preRoundTime > 0) {
      const interval = setInterval(() => {
        setPreRoundTime((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    if (remainingTime <= 0) {
      // Wyślij wiadomość o końcu gry do maliny
      mqttPublish({
        topic: "application/raspberry/gameEnd",
        payload: "",
        qos: 1,
      });
      return;
    }

    if (remainingTime === DRIVING_ROBOT_START_TIME_BEFORE_END) {
      // Wyślij wiadomość do maliny o zaczeciu jezdzacego robota
      mqttPublish({
        topic: "application/raspberry/runDrivingRobot",
        payload: "",
        qos: 1,
      });
    }

    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [preRoundTime, remainingTime]);

  const handleEndGameButton = () => {
    mqttPublish({
      topic: "application/raspberry/gameEndForce",
      payload: "",
      qos: 1,
    });
    mqttDisconnect();

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
          Gra gracza {player?.name}
        </h2>
        <div
          id="gameInfo"
          className="p-12 rounded-lg bg-gray-700 flex justify-center items-center font-semibold text-white"
          style={{
            display: preRoundTime === 0 ? "block" : "none",
          }}
        >
          <h3>
            {currentHit
              ? `Trafiono w: ${currentHit}`
              : remainingTime > 0
              ? `Wynik gracza: ${playerScore}`
              : "Traf w cel!"}
          </h3>
        </div>
        <h2 className="text-3xl font-bold text-gray-800">
          {preRoundTime > 0
            ? `Gra rozpocznie się za: ${preRoundTime}s`
            : remainingTime > 0
            ? `Pozostały czas: ${remainingTime}s`
            : "Koniec rundy!"}
        </h2>
      </div>
    </div>
  );
}
