const app = require('express');
const morgan = require('morgan');
const cors = require('cors');

const PORT = process.env.PORT || 3001

const server = app();
const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

const logger = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ');
});
server.use(app.static('dist'))
server.use(cors());
server.use(app.json());
server.use(logger);

server.get('/api/persons', (req, res) => {
  res.send(persons);
});

server.get('/info', (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
});

server.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.send(person);
  } else {
    res.status(404).end();
  }
});

server.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'name or number is missing' 
    });
  }

  const nameExists = persons.find(person => person.name === body.name);
  if (nameExists) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number
  };

  persons.push(newPerson);
  res.json(newPerson);
});

server.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = persons.findIndex(person => person.id === id);
  if (index !== -1) {
    persons.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});