const { Router } = require("express");
const {
  getAllRaffles,
  getRaffleAndPart,
  getRaffleById,
} = require("../queries/raffleQueries");

const raffleController = Router();

raffleController.get("/", async (request, response) => {
  try {
    const r = await getAllRaffles();
    response.status(200).json({ data: r });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

raffleController.get("/:id", async (request, response) => {
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

raffleController.get("/:id/participants", async (request, response) => {
  try {
    const { id } = request.params;
    const data = await getActorAndCharacters(id);
    if (!data.length) {
      response
        .status(404)
        .json({ error: `Could not find raffle with id ${id}` });
    } else response.status(200).json({ data: data });
  } catch (err) {
    response.status(500).json({ error: err.message });
  }
});

module.exports = raffleController;
