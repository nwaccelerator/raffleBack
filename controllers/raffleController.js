const { Router } = require("express");
const {
  getAllRaffles,
  getRaffleAndPart,
  getRaffleById,
  createRaffle,
  pickWinner,
} = require("../queries/raffleQueries");

const {
  validateId,
  isValidNewRaffle,
  isValidPhone,
  validateDraw,
} = require("../lib/middleware");

const raffleController = Router();

raffleController.get("/", async (request, response) => {
  try {
    const r = await getAllRaffles();
    response.status(200).json({ data: r });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

raffleController.get("/:id", validateId, async (request, response) => {
  try {
    const { id } = request.params;
    const r = await getRaffleById(id);
    if (!r) {
      response
        .status(404)
        .json({ error: `Could not find raffle with id ${id}` });
    }
    response.status(200).json({ data: r });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

raffleController.get(
  "/:id/participants",
  validateId,
  async (request, response) => {
    try {
      const { id } = request.params;
      const data = await getRaffleAndPart(id);
      if (!data.length) {
        response
          .status(404)
          .json({ error: `Could not find raffle with id ${id}` });
      } else response.status(200).json({ data: data });
    } catch (err) {
      response.status(500).json({ error: err.message });
    }
  },
);

raffleController.post(
  "/",
  isValidNewRaffle,
  isValidPhone,
  async (request, response) => {
    const r = request.body;
    try {
      const newRow = await createRaffle(r);
      response.status(201).json({ data: newRow });
    } catch (error) {
      response.status(500).send("Internal Server Error");
    }
  },
);

raffleController.put(
  "/:id/winner",
  validateId,
  validateDraw,
  async (request, response) => {
    const r = request.body;
    try {
      const newRow = await pickWinner(r);
      response.status(201).json({ data: newRow });
    } catch (error) {
      response.status(500).send("Internal Server Error");
    }
  },
);

module.exports = raffleController;
