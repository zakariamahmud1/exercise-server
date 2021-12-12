const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const PhonebookSchema = new mongoose.Schema({
    name:  { type: String, minLength: 3, required: true, unique: true },
    number:  { type: String, minLength: 8},
})
// Apply the uniqueValidator plugin to userSchema.
PhonebookSchema.plugin(uniqueValidator);

PhonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Phonebook', PhonebookSchema)