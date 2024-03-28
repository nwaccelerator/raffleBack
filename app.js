const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const raffleController = require("./controllers/raffleController");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Controller
app.use("/raffles", raffleController);

// Health check
app.get("/", (request, response) => {
  response.status(200).json({ data: "Server is running!" });
});

app.get("/*", (request, response) => {
  response.status(404).send("not found");
});

module.exports = app;
