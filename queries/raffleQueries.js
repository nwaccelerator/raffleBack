const db = require("../db");

const getAllRaffles = async () => {
  const actors = await db.any(
    "SELECT id, name, created_at, winner_id FROM raffle order by id;",
  );
  return actors;
};

const getRaffleById = async (id) => {
  const actor = await db.oneOrNone("SELECT * FROM raffle WHERE id = $1", id);
  return actor;
};

const getRaffleAndPart = async (id) => {
  const characters = await db.any(
    `SELECT r.id, name, created_at, winner_id, pt.id p_id, first_name, last_name, email, phone, count(*) over (partition by r.id) as result_count from raffle r left join participants_raffle
p on r.id = raffle_id left join participants pt on participant_id = pt.id where r.id = $1`,
    id,
  );
  return characters;
};

const getPartFromNewRaffle = async (id) => {
  const characters = await db.any(
    `SELECT r.*, p.participant_id p_id from raffle r left join participants_raffle
p on r.id = raffle_id where raffle_id = $1 and winner_id is NULL`,
    id,
  );
  return characters;
};

const createRaffle = async (args) => {
  const newRow = await db.any(
    `insert into raffle(name, secret_token) values ($1, $2)
returning *`,
    [args["name"], args["secret_token"]],
  );
  return newRow;
};

const addNewParticipant = async (args) => {
  const newRow = await db.oneOrNone(
    `insert into participants(first_name, last_name, email, phone) values ($1, $2, $3, $4) on conflict do nothing returning *`,
    [
      args["first_name"].trim(),
      args["last_name"].trim(),
      args["email"],
      args?.phone || null,
    ],
  );
  return newRow;
};

const addNewRaffleParticipant = async (id, args) => {
  const newRow = await db.oneOrNone(
    `insert into participants_raffle(raffle_id, participant_id) values ($1, (select id from participants where email = $2)) on conflict do nothing returning *`,
    [id, args["email"]],
  );
  return newRow;
};

const pickWinner = async (id, args, contest) => {
  let l = contest.length;
  const randIdx = Math.floor(Math.random() * l);
  const winner = await db.oneOrNone(
    `update raffle set winner_id = $1 where id = $2 and secret_token = $3 returning winner_id;`,
    [contest[randIdx], id, args["secret_token"]],
  );
  return winner;
};

const getRaffleWinner = async (id) => {
  const actor = await db.oneOrNone(
    `select r.id, name, created_at, winner_id, first_name, last_name, email, phone
from raffle r join participants_raffle pr on (r.id = raffle_id and winner_id = participant_id) join participants p on participant_id = p.id where r.id = $1`,
    id,
  );
  return actor;
};

module.exports = {
  getAllRaffles,
  getRaffleById,
  getRaffleAndPart,
  getPartFromNewRaffle,
  addNewParticipant,
  addNewRaffleParticipant,
  createRaffle,
  pickWinner,
  getRaffleWinner,
};
