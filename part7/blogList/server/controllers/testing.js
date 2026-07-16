const express = require('express')
const Blog = require('../models/blogScheme') // tu modelo de Blog
const User = require('../models/user') // tu modelo de User

const testingRouter = express.Router()

testingRouter.post('/reset', async (req, res) => {
  if (process.env.NODE_ENV === 'test') {
  await Blog.deleteMany({})
  await User.deleteMany({})
  res.status(204).end()
  } else {
    res.status(403).json({ error: 'Resetting the database is only allowed in test environment' })
  }
})

module.exports = testingRouter
