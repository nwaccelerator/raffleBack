drop table
  if exists raffle cascade;

drop table
  if exists participants cascade;

drop table
  if exists participants_raffle;

create table
  raffle (
    id serial primary key,
    name varchar not null,
    secret_token varchar not null,
    created_at timestamptz default now() not null,
    winner_id integer,
    constraint uniq_nm_ca unique (name, created_at)
  );

create table
  participants (
    id serial primary key,
    first_name varchar not null,
    last_name varchar not null,
    email varchar not null unique,
    phone varchar
  );

create table
  participants_raffle (
    jt_id serial primary key,
    raffle_id integer not null REFERENCES raffle(id) on delete cascade,
    participant_id integer not null REFERENCES participants(id) on delete cascade,
CONSTRAINT unique_raffle_participant UNIQUE (raffle_id, participant_id)
  );

ALTER TABLE
  raffle
ADD
  CONSTRAINT winner_fk FOREIGN KEY (winner_id) REFERENCES participants_raffle(participant_id) on delete cascade;
