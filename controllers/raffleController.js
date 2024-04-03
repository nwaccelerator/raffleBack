const { Router } = require("express");
const {
  getAllRaffles,
  getRaffleAndPart,
  getPartFromNewRaffle,
  getRaffleById,
  createRaffle,
  addNewParticipant,
  getRaffleWinner,
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
    const data = await getAllRaffles();
    response.status(200).json({ data });
  } catch (error) {
    response.status(500).json({ error: err.message });
  }
});

raffleController.get("/:id", validateId, async (request, response) => {
  try {
    const { id } = request.params;
    const data = await getRaffleById(id);
    if (!data) {
      response
        .status(404)
        .json({ error: `Could not find raffle with id ${id}` });
    } else response.status(200).json({ data });
  } catch (error) {
    response.status(500).json({ error });
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
      } else response.status(200).json({ data });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },
);

raffleController.get("/:id/winner", validateId, async (request, response) => {
  try {
    const { id } = request.params;
    const data = await getRaffleWinner(id);
    if (!data) {
      response.status(404).json({ error: `No winner in raffle of id ${id}` });
    } else response.status(200).json({ data });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

raffleController.post("/", isValidNewRaffle, async (request, response) => {
  const r = request.body;
  try {
    const newRow = await createRaffle(r);
    response.status(201).json({ data: newRow });
  } catch (error) {
    response.status(500).json({ error: error.message });
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
      if (newRow) response.status(201).json({ data: newRow });
    } catch (error) {
      response.status(500).json({ error: error.message });
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
          if (newRow) response.status(200).json({ data: newRow });
          else
            response
              .status(403)
              .json({ error: `Unauthorized invalid secret_token` });
        } catch (error) {
          response.status(500).json({ error: error.message });
        }
      } else {
        response
          .status(400)
          .json({ error: `No contestants for raffle id ${id}` });
      }
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },
);

module.exports = raffleController;
