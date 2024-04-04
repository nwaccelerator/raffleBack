const { Router } = require("express");
const {
  getAllRaffles,
  getRaffleAndPart,
  getPartFromNewRaffle,
  getRaffleById,
  createRaffle,
  addNewParticipant,
  addNewRaffleParticipant,
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
      } else if (data[0].result_count == 1 && !data[0].p_id) {
        response.status(200).json({ data: [] });
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
      const result = await getRaffleById(request.params.id);
      if (!result) {
        return response.status(404).json({
          error: `Could not find raffle with id ${request.params.id}`,
        });
      } else if (result?.winner_id != null)
        return response.status(400).json({
          error: `raffle with id ${request.params.id} is not accepting new participants`,
        });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }

    try {
      const newRow = await addNewParticipant(r);
      const newRowJt = await addNewRaffleParticipant(
        request.params.id,
        newRow?.id,
      );
      if (newRowJt?.jt_id) response.status(201).json({ data: newRowJt });
      else
        response.status(400).json({
          error: `invalid participant for raffle id ${request.params.id}`,
        });
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
