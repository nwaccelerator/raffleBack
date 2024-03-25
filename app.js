const express = require("express");
const cors = require("cors");
const raffleController = require("./controllers/raffleController");
const partController = require("./controllers/partController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Controllers
app.use("/raffle", raffleController);
app.use("/participants", partController);

// Health check
app.get("/", (request, response) => {
  response.status(200).json({ data: "Server is running!" });
});

app.get("/*", (request, response) => {
  response.status(404).send("not found");
});

module.exports = app;
