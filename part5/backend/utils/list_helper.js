const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const createNewUser = async (username = "Test", name = "Test User", password = "defaultPassword") => {
    const bcrypt = require('bcrypt')
    const User = require('../models/user')

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()
    return savedUser
}

const RemoveAllUsers = async () => {
    const User = require('../models/user')
    await User.deleteMany({})
}

module.exports = {
  dummy,
  totalLikes,
  createNewUser,
  RemoveAllUsers
}