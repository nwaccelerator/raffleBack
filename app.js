const express = require("express");
const cors = require("cors");
const raffleController = require("./controllers/raffleController");
const partController = require("./controllers/partController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Controllers
app.use("/raffles", raffleController);

// Health check
app.get("/", (request, response) => {
  response.status(200).json({ data: "Server is running!" });
});

app.get("/*", (request, response) => {
  response.status(404).send("not found");
});

module.exports = app;
