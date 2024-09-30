"use client";
import { useState, useEffect } from "react";
const checkIfWordExists = async (word) => {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    return response.ok;
  } catch (error) {
    console.error("Error checking word:", error);
    return false;
  }
};
const submitGameResult = async (guesses_taken: number, name: string) => {
  try {
    const response = await fetch("http://localhost:3001/store-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guesses_taken: guesses_taken,
        name: name,
      }),
    });

    if (response.ok) {
      console.log("Game result submitted successfully");
    } else {
      console.error("Error submitting game result");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export default function Word() {
  const [guessCount, setGuessCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [rows, setRows] = useState(Array(6).fill(Array(6).fill("")));
  const [feedback, setFeedback] = useState(Array(6).fill(Array(6).fill("")));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [word, setWord] = useState("");
  const [gameState, setGameState] = useState(true);
  useEffect(() => {
    setWord("BEFORE");
  }, []);

  const countLetterOccurrences = (str) => {
    const counts = {};
    for (let letter of str) {
      counts[letter] = (counts[letter] || 0) + 1;
    }
    return counts;
  };

  const handleKeyDown = async (event) => {
    if (isChecking) return;
    if (!gameState) return;

    if (
      guessCount < 6 &&
      event.key.length === 1 &&
      /^[a-zA-Z]$/.test(event.key)
    ) {
      const newRows = rows.map((row) => [...row]);
      newRows[currentRow][currentCol] = event.key.toUpperCase();
      setRows(newRows);

      if (currentCol + 1 < 6) {
        setCurrentCol(currentCol + 1);
      }
    } else if (guessCount < 6 && event.key === "Backspace") {
      if (currentCol > 0) {
        const newRows = rows.map((row, rowIndex) => {
          if (rowIndex === currentRow) {
            const newRow = [...row];
            newRow[currentCol - 1] = ""; // Clear the previous letter
            return newRow;
          }
          return row;
        });
        setRows(newRows);
        setCurrentCol(currentCol - 1);
      }
    } else if (guessCount < 6 && guessCount < 6 && event.key === "Enter") {
      if (rows[currentRow].every((letter) => letter !== "")) {
        const currentGuess = rows[currentRow].join("");
        setIsChecking(true);

        const isValid = await checkIfWordExists(currentGuess);
        if (!isValid) {
          alert(`invalid word ${currentGuess}`);
          setIsChecking(false);
          return;
        }

        const newFeedback = [...feedback];
        const feedbackForRow = Array(6).fill("");
        const wordLetterCounts = countLetterOccurrences(word);

        // First pass: check for correct positions (green)
        for (let i = 0; i < 6; i++) {
          if (currentGuess[i] === word[i]) {
            feedbackForRow[i] = "green";
            wordLetterCounts[currentGuess[i]]--;
          }
        }

        // Second pass: check for wrong position but correct letter (yellow)
        for (let i = 0; i < 6; i++) {
          if (
            feedbackForRow[i] !== "green" &&
            word.includes(currentGuess[i]) &&
            wordLetterCounts[currentGuess[i]] > 0
          ) {
            feedbackForRow[i] = "yellow";
            wordLetterCounts[currentGuess[i]]--;
          }
        }

        // Third pass: mark as gray for letters not in the word
        for (let i = 0; i < 6; i++) {
          if (feedbackForRow[i] === "") {
            feedbackForRow[i] = "gray";
          }
        }

        newFeedback[currentRow] = feedbackForRow;
        setFeedback(newFeedback);
        setGuessCount(guessCount + 1);
        if (currentGuess === word) {
          alert("Congratulations! You've guessed the word!");
          const name = prompt("Enter your name:");
          setGameState(false);
          await submitGameResult(guessCount + 1, name);
        } else {
          if (currentRow + 1 < rows.length) {
            setCurrentRow(currentRow + 1);
            setCurrentCol(0);
          } else {
            alert(`Game over! Word was ${word}`);
          }
        }

        setIsChecking(false);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div></div>
      <div>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              marginBottom: "10px",
              border:
                rowIndex === currentRow
                  ? "2px solid #00796b"
                  : "1px solid black",
            }}
          >
            {row.map((letter, letterIndex) => (
              <div
                key={letterIndex}
                style={{
                  width: "50px",
                  height: "50px",
                  border: "1px solid black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "2px",
                  fontSize: "30px",
                  fontWeight: "bold",
                  backgroundColor:
                    feedback[rowIndex][letterIndex] === "green"
                      ? "#66bb6a"
                      : feedback[rowIndex][letterIndex] === "yellow"
                      ? "#ffeb3b"
                      : feedback[rowIndex][letterIndex] === "gray"
                      ? "#bdbdbd"
                      : "transparent",
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
