"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

interface LeaderboardEntry {
  name: string;
  guesses_taken: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Connect to WebSocket server
    const socket = io("http://localhost:3001", {
      transports: ["websocket"],
    });
    // Listen for leaderboard updates
    socket.on("leaderboard-update", (data: LeaderboardEntry[]) => {
      setLeaderboard(data); // Update state with new leaderboard
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Today's Best:</h1>
      <ul style={styles.list}>
        {leaderboard.map((entry, index) => (
          <li key={index} style={styles.listItem}>
            <span style={styles.name}>{entry.name}</span>:
            <span style={styles.guesses}>{entry.guesses_taken} guesses</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    height: "30vh",
    padding: "1rem",
    backgroundColor: "#f5f5f5",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  },
  title: {
    fontSize: "1.5rem",
    textAlign: "center" as const,
    color: "#333",
    marginBottom: "1rem",
  },
  list: {
    listStyleType: "none" as const,
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: "0.5rem 0",
    fontSize: "1.2rem",
    borderBottom: "1px solid #ddd",
    display: "flex",
    justifyContent: "space-between" as const,
  },
  name: {
    fontWeight: "bold" as const,
  },
  guesses: {
    color: "#888",
  },
};
