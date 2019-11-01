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

app.get('/info', (req, res) => {
  Person.countDocuments({}, (err, count) => {
    res.end(`Phonebook has info of ${count} people\n${new Date()}`);
  });
});

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((personsFromDatabase) => {
      res.json(personsFromDatabase);
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const person = new Person(req.body);
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook!`);
  })
    .then((savedPerson) => {
      res.status(201).json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson.toJSON());
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      console.log(`deleted ${result}`);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'MongoNetworkError') {
    return res.status(500).send({ error: 'error connecting to database' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
