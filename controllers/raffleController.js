const { Router } = require("express");
const {
  getAllRaffles,
  getRaffleAndPart,
  getPartFromNewRaffle,
  getRaffleById,
  createRaffle,
  addNewParticipant,
  pickWinner,
} = require("../queries/raffleQueries");

const {
  validateId,
  isValidNewRaffle,
  isValidParticipant,
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

raffleController.get("/:id/winner", validateId, async (request, response) => {
  try {
    const { id } = request.params;
    const data = await getRaffleWinner(id);
    if (!data.length) {
      response.status(404).json({ error: `No winner in raffle of id ${id}` });
    } else response.status(200).json({ data: data });
  } catch (error) {
    response.status(500).json({ error });
  }
});

raffleController.post("/", isValidNewRaffle, async (request, response) => {
  const r = request.body;
  try {
    const newRow = await createRaffle(r);
    response.status(201).json({ data: newRow });
  } catch (error) {
    response.status(500).json({ error });
  }
});

raffleController.post(
  "/:id/participants",
  validateId,
  isValidPhone,
  isValidParticipant,
  async (request, response) => {
    const r = request.body;
    try {
      const newRow = await addNewParticipant(r, request.params.id);
      response.status(201).json({ data: newRow });
    } catch (error) {
      response.status(500).json({ error });
    }
  },
);

raffleController.put(
  "/:id/winner",
  validateId,
  validateDraw,
  async (request, response) => {
    const r = request.body;
    const { id } = request.params;
    try {
      let contest = await getPartFromNewRaffle(id);
      if (contest.length) {
        contest = contest.map((item) => item?.p_id);
        try {
          const newRow = await pickWinner(id, r, contest);
          //return winner_id
          response.status(200).json({ data: newRow });
        } catch (error) {
          response.status(500).json({ error });
        }
      } else {
        response
          .status(400)
          .json({ error: `No contestants for raffle id ${id}` });
      }
    } catch (error) {
      response.status(500).send("Internal Server Error");
    }
  },
);

module.exports = raffleController;
