import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function ScoreboardPage({ sessionUser }) {
  const [scoreboardData, setScoreboardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionUser) {
        console.log("Session user is not set");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/getScoreboardData",
          {
            user_id: sessionUser.id,
          },
          { withCredentials: true, credentials: "include" }
        );

        const sortedData = response.data?.scoreboard.sort((a, b) => {
          return new Date(b.game_timestamp) - new Date(a.game_timestamp);
        });

        setScoreboardData(sortedData);
      } catch (error) {
        console.error(error.response || "Something went wrong");
      }
    };

    fetchData();
  }, [sessionUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl bg-blue-400 rounded-lg shadow-md flex flex-col text-center">
        <Link
          to="\dashboard"
          className="w-100 p-2 bg-blue-400 rounded-tl-lg rounded-tr-lg hover:bg-blue-300 focus:ring-4 focus:ring-blue-300"
        >
          Wróć
        </Link>
        <h2 className="w-full text-3xl font-bold text-gray-800">Statystyki</h2>
        <div className="space-y-4 m-4">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="right">Data i czas gry</TableCell>
                  <TableCell>Nazwa gracza</TableCell>
                  <TableCell align="right">Wynik</TableCell>
                  <TableCell align="right">Czas trwania rundy</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scoreboardData.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell align="right">
                      {new Date(row.game_timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{row.player_name}</TableCell>
                    <TableCell align="right">{row.score}</TableCell>
                    <TableCell align="right">{row.game_time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
