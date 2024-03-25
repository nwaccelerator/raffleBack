drop table
  if exists raffle cascade;

drop table
  if exists participants;

create table
  raffle (
    id serial primary key,
    name varchar not null,
    secret_token varchar not null,
    created_at timestamptz default now() not null,
    winner_id integer,
    constraint uniq_t_n unique (name, created_at),
    constraint uniq_winner_id unique (id, winner_id)
  );

create table
  participants (
    id serial primary key,
    first_name varchar not null,
    last_name varchar not null,
    email varchar not null,
    phone varchar,
    raffle_id integer not null,
    constraint uniq_email_raf unique (email, raffle_id)
  );

ALTER TABLE
  raffle
ADD
  CONSTRAINT winner_fk FOREIGN KEY (winner_id) REFERENCES participants(id) on delete cascade;

ALTER TABLE
  participants
ADD
  CONSTRAINT raffle_fk FOREIGN KEY (raffle_id) REFERENCES raffle(id) on delete cascade;
