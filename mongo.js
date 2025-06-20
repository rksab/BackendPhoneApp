const mongoose = require('mongoose')

// take in password, name and number
if (process.argv.length < 3 || process.argv.length > 3 &&  process.argv.length<5) 
  {
    console.log('give password, name, number as argument')
    process.exit(1)
  }
const {2: password, 3: name, 4: number} = process.argv

const url = `mongodb+srv://ramansarabha:${password}@cluster0.pbtpal7.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String, 
    number: String, 
})

const Person = mongoose.model('Person', personSchema)

if (name && number) {
    const person = new Person({
        name: name, 
        number: number, 
    })
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook.`)})
    mongoose.connection.close()
}else {

    Person.find({}).then(result => {
        result.forEach((p) => {
            console.log(`${p.name} ${p.number}`)
        })
    mongoose.connection.close()
    })
}