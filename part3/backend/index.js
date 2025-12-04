require("dotenv").config();
const app = require("express");
const morgan = require("morgan");
const cors = require("cors");
const PhoneNumber = require("./models/phoneNumber");

const PORT = process.env.PORT || 3001;

const server = app();
const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const logger = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    JSON.stringify(req.body),
  ].join(" ");
});
server.use(app.static("dist"));
server.use(cors());
server.use(app.json());
server.use(logger);

server.get("/api/persons", (req, res) => {
  PhoneNumber.find({}).then((persons) => {
    res.json(persons);
  });
});

server.get("/info", (req, res) => {
  const date = new Date();
  PhoneNumber.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
    );
  });
});

server.get("/api/persons/:id", (req, res, next) => {
  const id = Number(req.params.id);
  PhoneNumber.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

server.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "name or number is missing",
    });
  }

  const nameExists = persons.find((person) => person.name === body.name);
  if (nameExists) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const newPerson = new PhoneNumber({
    name: body.name,
    number: body.number,
  });

  PhoneNumber.create(newPerson).then((savedPerson) => {
    res.json(savedPerson);
  }).catch((error) => {
    next(error.errors.name || error.errors.number);
  });
});

server.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  PhoneNumber.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

server.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  PhoneNumber.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

const errorHandler = (error, request, response, next) => {

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  if(error.name === "ValidatorError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

server.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
