const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
//connect to database
mongoose
  .connect(url)
  .then(result => {
    console.log('connected to Mongodb')
  })
  .catch(error => {
    console.log('error connecting to the database', error.message)
  })

const personSchema = new mongoose.Schema({
    name: { type: String,
            minLength: [3, 'Name must be at least 3 characters long'], 
            required: [true, 'None in required'] }, 
    number: { type: String, 
              minLength: 8, 
              required: [true, 'Phone number is required'], 
              validate: {
                validator: function (v) {
                  return /^\d{2,3}-\d+$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number. Format should be 2-3 digits, dash, then digits (e.g. 040-1234567)`
              }
            }, 
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)