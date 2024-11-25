import React, { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/login", {
        login,
        password,
      });

      setMessage(response.data.message || "");
      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (error.response) {
        setMessage(error.response.data.message || "Authentication failed");
      } else {
        setMessage("An error occurred, please try again later");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Point Tag
        </h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Login
            </label>
            <input
              type="login"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Wprowadź login"
              required
              className="block w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Hasło
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Wprowadź hasło"
              required
              className="block w-full px-4 py-2 mt-1 text-gray-700 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            Zaloguj się
          </button>
        </form>
        {message && <div>{message}</div>}
      </div>
    </div>
  );
};

export default LoginPage;
