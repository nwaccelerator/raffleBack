const validateId = (req, res, next) => {
  const { id } = req.params;
  if (Number.isInteger(+id) && +id > -1) {
    next();
  } else {
    res.status(400).json({ error: "Invalid id requires integer" });
  }
};

const isValidNewRaffle = (req, res, next) => {
  if (
    req.body.hasOwnProperty("name") &&
    req.body.hasOwnProperty("secret_token")
  ) {
    const { name, secret_token } = req.body;
    const arr = [];
    if (
      typeof secret_token != "string" ||
      secret_token.length < 5 ||
      secret_token.length > 16
    ) {
      arr.push("secret_key should be a string with length between 5 and 15");
    }
    if (typeof name != "string" || name.length < 2) {
      arr.push("name string required with length greater than 1");
    }

    if (arr.length) {
      res.status(400).json({ error: `Invalid: ${arr.join(" , ")}` });
    } else {
      next();
    }
  } else {
    res
      .status(400)
      .json({ error: "For new raffle name and secret_token required" });
  }
};

const isValidParticipant = (req, res, next) => {
  const required = ["first_name", "last_name", "email", "raffle_id"];
  let count = 0;
  const c = Object.keys(req.body);
  const bk = [];
  for (let k of c) {
    if (k != "phone" && required.includes(k)) {
      count++;
    } else if (k != "phone") {
      bk.push(k);
    }
  }
  if (count === 4) {
    next();
  } else {
    res.status(400).json({
      error: `Invalid request body${bk.length ? " " + bk.join(", ") : ""}`,
    });
  }
};

const isValidPhone = (req, res, next) => {
  if (req.body.hasOwnProperty("phone") && typeof req.body.phone === "string") {
    let num = req.body.phone;
    let rnum = num.replace(/\D/g, "");
    if (rnum.length > 6 && rnum.length < 9) {
      next();
    } else {
      res.status(400).json({ error: `Invalid phone number` });
    }
  } else if (
    req.body.hasOwnProperty("phone") &&
    typeof req.body.phone != "string"
  ) {
    res.status(400).json({ error: `Invalid type of phone value` });
  } else {
    next();
  }
};

const isValidEmail = (req, res, next) => {
  const EMAIL_REGEX =
    /([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+/;
  if (req.body.hasOwnProperty("email")) {
    let t = EMAIL_REGEX.test(req.body.email);
    if (!t) {
      res.status(400).json({ error: `Invalid email string` });
    } else {
      next();
    }
  } else {
    res.status(400).json({ error: `email string required` });
  }
};

const validateDraw = (req, res, next) => {
  if (req.body.hasOwnProperty("secret_token")) {
    if (Object.keys(req.body) > 1) {
      res.status(400).json({ error: `Invalid request body` });
    } else {
      const { secret_token } = req.body.secret_token;
      if (typeof secret_token != "string") {
        res.status(400).json({ error: `secret_token must be string` });
      } else {
        next();
      }
    }
  } else {
    res.status(400).json({ error: `secret_token required` });
  }
};

module.exports = {
  validateId,
  isValidNewRaffle,
  isValidParticipant,
  isValidPhone,
  isValidEmail,
  validateDraw,
};
