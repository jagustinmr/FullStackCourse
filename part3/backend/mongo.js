const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneNumberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const PhoneNumber = mongoose.model('PhoneNumber', phoneNumberSchema)

if (process.argv.length===3) {
  PhoneNumber.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(phoneNumber => {
      console.log(phoneNumber.name, phoneNumber.number)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length===5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const phoneNumber = new PhoneNumber({
    name: name,
    number: number,
  })

  phoneNumber.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}