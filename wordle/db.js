// db.js
const mysql = require("mysql2");

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost", // Replace with your MySQL server address (localhost if on the same machine)
  user: "root", // Replace with your MySQL username
  password: "Tplink150", // Replace with your MySQL password
  database: "wordle", // Replace with the name of your MySQL database
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1); // Exit the process with an error
  }
  console.log("Connected to MySQL database");
});

// Export the connection to use in other files
module.exports = connection;
