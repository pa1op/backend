require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();


morgan.token('body', (req) => JSON.stringify(req.body));

app.use(bodyParser.json());
app.use(morgan(':method :url :status :response-time ms :body'));
app.use(cors());
app.use(express.static('build'));

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/info', (req, res) => {
  res.end(`Phonebook has  info of ${persons.length} people\n${new Date()}`);
});

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then((personsFromDatabase) => {
      res.json(personsFromDatabase);
    })
    .catch((error) => {
      console.log('error connecting to MongoDB:', error.message);
    });
});

app.post('/api/persons', (req, res) => {
  const person = new Person(req.body);
  if (persons.map((person) => person.name).includes(person.name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook!`);
  });
  return res.status(201).json(person);
});

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find((person) => person.id === Number(req.params.id));
  return person ? res.json(person) : res.status(404).end();
});

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id));
  res.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
