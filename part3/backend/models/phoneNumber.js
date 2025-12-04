const mongoose = require('mongoose');

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)

const phoneNumberSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'],
    required: true
  },
  number: {
    type: String,
    minlength: [8, 'Number must be at least 8 characters long'],
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{8,}$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
})

phoneNumberSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model('PhoneNumber', phoneNumberSchema)