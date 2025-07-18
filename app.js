// ========== Packages ==========
// Initialising dotenv
require("dotenv").config();
// Initialising express
const express = require("express");
// Initialising path
const path = require("path");
// Initialising template Routes
const templateRoutes = require("./controllers/template/template.routes");
const categoryEmissionsRoutes = require("./controllers/categoryEmissions/categoryEmissions.routes");

// ========== WebSocket Server ==========
const http = require("http");
const cors = require("cors");

// ========== Set-Up ==========
// Initiating app
const app = express();
const port = 8000;

// Set up HTTP and WebSocket servers

// Apply CORS middleware BEFORE defining routes
app.use(cors());

const server = http.createServer(app);

// Using Static Public
app.use(express.static(path.join(__dirname, "public")));

// Using JSON with increased limit
app.use(express.json({ limit: "100mb" })); // Increase the limit as needed

// Using URL-encoded with increased limit
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Return index.html at default endpoint
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, ".", "public", "index.html"));
});

// ========== Routes ==========
// Template Route
app.use("/api/template", templateRoutes);
app.use("/api/categoryEmissions", categoryEmissionsRoutes);

// ========== Initialise Server ==========
// Server Listening at port 8000
const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`;

server.listen(port, async () => {
  console.log(`Server successfully running on ${serverUrl}`);
  console.log("Press CTRL+C to stop the server.");
});
// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  process.exit(0); // Exit with code 0 indicating successful shutdown
});

process.on("uncaughtException", (err) => {
  console.error("[ERROR] Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("[ERROR] Unhandled Rejection:", reason);
});
