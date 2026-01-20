const BlogRouter = require('express').Router()
const Blog = require('../models/blogScheme')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

BlogRouter.get('/', async (request, response, next) => {

  try {
    const result = await Blog.find({})
    response.status(200).json(result)
  } catch (error) {
      next(error)
  }
})

BlogRouter.post('/', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
    const blog = new Blog({...request.body, user: user._id})
    const result = await blog.save()
    response.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

BlogRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

BlogRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const result = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

    if (result === null) {
      return response.status(404).end()
    }

    response.status(200).json(result)
  } catch (error) {
    next(error)
  }
})  

module.exports = BlogRouter