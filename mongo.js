const mongoose = require('mongoose')
require('dotenv').config()

if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url =  `mongodb+srv://zakariamahmud:${password}@cluster0.ls7mr.mongodb.net/phonebook-app?retryWrites=true&w=majority`
mongoose.connect(url)


const PhonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Phonebook = mongoose.model('Phonebook', PhonebookSchema)

/*
const phonebook = new Phonebook({
    
    name: personName,
    number: personNumber,
})


phonebook.save().then(result=>{
    console.log(`Added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close() 
})
*/

Phonebook.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(book => {
      console.log(`${book.name} ${book.number}`)
      
    })
    mongoose.connection.close()
  
  })
    
