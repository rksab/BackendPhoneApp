require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req) =>
  Object.values(req.body)[0] ? JSON.stringify(req.body) : null
)
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.get('/', (request, response) => {
    response.send("<h1> Hello World </h1>")
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch((error) => next(error))
  })

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
   .then(person => 
        person ? response.json(person): response.status(404).end()
  )
   .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
   Person.estimatedDocumentCount({})
    .then(count => {
      const msg = `<p> Phonebook has ${count} people. ${new Date().toString()}</p>`
      response.send(msg)
    })
    .catch(error => next(error))
  })

app.delete('/api/persons/:id', (request, response, next) => {
   Person.findByIdAndDelete(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => next(error))
  })

app.post('/api/persons', (request, response, next) => {
    const {name, number} = request.body
  
    if (!name || !number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const person = new Person({name, number})
    person.save()
       .then(savedPerson => response.json(savedPerson))
       .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body
    if (!name || !number) 
       return response.status(400).json({error: 'name or number missing'})
    Person.findByIdAndUpdate(
      request.params.id, 
      {name, number}, 
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }else if (error.name === 'ValidationError'){
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  app.use(unknownEndpoint)
  app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
 })




