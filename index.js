
const express= require('express')
const morgan = require('morgan')
const cors = require('cors')

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
    response.json(phonesBook)
})


app.get('/api/info', (request, response)=>{
    response.send(`Phonebook has info for ${phonesBook.length} people \n
    ${ new Date()}`)
})

app.get('/api/phonebook/:id', (request, response)=>{
    const id = Number(request.params.id)
    console.log(id)
    const phonebook = phonesBook.find(phone => phone.id === id)
    if(phonebook){
      response.json(phonebook)
    }else{
        response.status(404).end()
    }
  
})

app.delete('/api/phonebook/:id', (request, response) =>{
    const id = Number(request.params.id)
    phonesBook= phonesBook.filter(phone=> phone.id !== id)
    response.status(204).end()
})

const generateId= () =>{
    const maxId = phonesBook.length > 0 ? Math.max(...phonesBook.map(phone=> phone.id)) : 0
    return maxId + 1
}

app.post('/api/phonebook', (request, response)=>{
  const body = request.body
  if(!body.name || !body.phone){
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

const phonebook = {
    name: body.name,
    phone: body.phone,
    id: generateId(),
  }
phonesBook = phonesBook.concat(phonebook)

response.json(phonesBook)
})



const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)