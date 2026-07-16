const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert/strict');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app');

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    })
  test('creation succeeds with a fresh username', async () => {
    const newUser = {
      username: 'testUser',
      name: 'Test user',
      password: '12345',
    }

     await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersInDb = await User.find({});

    const usernames = usersInDb.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

after(async () => {
  await mongoose.connection.close()
})