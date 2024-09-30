const mysql = require("mysql2");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const app = express();
const port = 3001;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Ensure this is your frontend address
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Tplink150",
  database: "wordle",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

// Fetch leaderboard sorted by guesses_taken
function emitLeaderboardUpdate() {
  const query = "SELECT * FROM leaderboard ORDER BY guesses_taken ASC"; // Sorting by least guesses
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching leaderboard:", err);
      return;
    }
    io.emit("leaderboard-update", results); // Emit leaderboard to clients
  });
}

app.post("/store-result", (req, res) => {
  const { guesses_taken, name } = req.body;
  const query = `INSERT INTO leaderboard (guesses_taken, name) VALUES (?, ?)`;
  db.query(query, [guesses_taken, name], (err, result) => {
    if (err) {
      console.error("Error inserting result:", err);
      return res.status(500).send("Error storing result");
    }
    emitLeaderboardUpdate(); // Notify clients of update
    res.status(200).send("Result stored successfully");
  });
});

// WebSocket connection event
io.on("connection", (socket) => {
  console.log("Client connected");

  // Send the initial leaderboard on connection
  emitLeaderboardUpdate();

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
