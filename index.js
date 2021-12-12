
const express= require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const phoneBooks = require('./models/phonebook')

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))

app.use(express.static('build'))
app.use(cors())

morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
  


let phonesBook = [
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
]

app.get('/api/phonebook', morgan('common'), (request, response)=>{
  phoneBooks.find({}).then(books => {
    response.json(books)
  })
})


app.get('/api/info', (request, response)=>{
    response.send(`Phonebook has info for ${phonesBook.length} people \n
    ${ new Date()}`)
})

app.get('/api/phonebook/:id', (request, response)=>{
  phoneBooks.findById(request.params.id)
  .then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
  
})

app.delete('/api/phonebook/:id', (request, response) =>{
  phoneBooks.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
   }).catch(error => next(error))
})

const generateId= () =>{
    const maxId = phonesBook.length > 0 ? Math.max(...phonesBook.map(phone=> phone.id)) : 0
    return maxId + 1
}

app.post('/api/phonebook', (request, response)=>{
  const body = request.body
  if(!body.name || !body.number){
      return response.status(400).json({
          error: 'Number or name missing'
      })
  }


const singlePhoneBook = phonesBook.find(phone => phone.name === body.name)
if(singlePhoneBook){
    return response.status(409).json({
        error: 'name must be unique' 
    }) 
}

const phonebook = new phoneBooks({
    name: body.name,
    number: body.number,

  })
  phonebook.save().then(savedBook => {
    response.json(savedBook)
  })
})

app.put('/api/phonebook/:id', (request, response, next) => {
  const body = request.body

  const book = {
    name: body.name,
    number: body.number,
  }

  phoneBooks.findByIdAndUpdate(request.params.id, book, { new: true })
    .then(updatedBook => {
      response.json(updatedBook)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)



const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)