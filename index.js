const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  res.end(`Phonebook has  info of ${persons.length} people\n${new Date()}`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (req, res) => {
  const person = req.body
  if (!person.name || !person.number) {
    return res.status(400).json({
      error: 'request must contain name and number'
    })
  }
  person.id = Math.floor(Math.random() * Math.floor(1000))
  if (persons.map(person => person.name).includes(person.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }
  persons = persons.concat(person)
  res.status(201).json(person)
})

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find((person) => person.id === Number(req.params.id))
  person ? res.json(person) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter((person) => person.id !== Number(req.params.id))
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
