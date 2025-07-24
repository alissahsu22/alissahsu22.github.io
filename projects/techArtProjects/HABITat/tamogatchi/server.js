const express = require("express");
const path = require("path");
const { SerialPort } = require("serialport");
const app = express();
const portNum = 3000;

const port = new SerialPort({
  path: "/dev/cu.usbmodem101", 
  baudRate: 9600,
});

// Track current mood
let currentMood = "neutral";

// Serve static files (HTML, CSS, JS, images from "public" folder)
app.use(express.static("public"));

// Handle trigger from front-end
app.get("/trigger", (req, res) => {
  const action = req.query.action;

  if (action === "good") {
    port.write("G", () => console.log("Sent G to port"));
    currentMood = "happy";
  } else if (action === "bad") {
    port.write("B", () => console.log("Sent B to port"));
    currentMood = "sad";
  }

  res.send("OK");
});

// Send current mood as JSON
app.get("/mood", (req, res) => {
  res.json({ mood: currentMood });
});

// Serve game.html manually if needed
app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "game.html"));
});

// Start server
app.listen(portNum, () => {
  console.log(`Server running at http://localhost:${portNum}`);
});
