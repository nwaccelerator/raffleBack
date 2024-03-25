const db = require("../db");

const getAllRaffles = async () => {
  const actors = await db.any("SELECT * FROM raffle;");
  return actors;
};

const getRaffleById = async (id) => {
  const actor = await db.oneOrNone("SELECT * FROM raffle WHERE id = $1", id);
  return actor;
};

const getRaffleAndPart = async (id) => {
  const characters = await db.any(
    `SELECT * from raffle r left join participants
p on r.id = raffle_id where raffle_id = $1`,
    id,
  );
  return characters;
};

module.exports = {
  getAllRaffles,
  getRaffleById,
  getRaffleAndPart,
};
