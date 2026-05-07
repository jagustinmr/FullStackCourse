const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert/strict');
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/list_helper')
const app = require('../app');
const { text } = require('node:stream/consumers');

const api = supertest(app)
let newTestUser;

beforeEach(async () => {
  if(!newTestUser) {
  newTestUser = await helper.createNewUser()
  }

  console.log('Creating test user:', newTestUser);
})


test('when blogs are returned as json return a 200', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

describe('checking id property', () => {
  test('If id property is defined should do not throw an error', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert.ok(blog.id, 'value should not be null or undefined')
    })
  })
})

describe('addition of a new blog', () => {
  test('when a valid blog can be added return a 201 and add the data', async () => {
    const newBlog = {
      title: 'New blog for testing',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5
    }

    const initialBlogs = await api.get('/api/blogs')

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.body.length + 1)

    const newBlogAdded = response.body.find(blog => blog.title === newBlog.title)
    assert.strictEqual(newBlogAdded.title, newBlog.title)
    assert.strictEqual(newBlogAdded.author, newBlog.author)
    assert.strictEqual(newBlogAdded.url, newBlog.url)
    assert.strictEqual(newBlogAdded.likes, newBlog.likes)
  })
});

describe('deletion of a blog', () => {
  test('when a blog can be deleted return a 204 and delete the data', async () => {
    const newBlog = {
      title: 'Blog to be deleted',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const newBlogAdded = response.body.find(blog => blog.title === newBlog.title)
    assert.strictEqual(newBlogAdded.title, newBlog.title)
    assert.strictEqual(newBlogAdded.author, newBlog.author)
    assert.strictEqual(newBlogAdded.url, newBlog.url)
    assert.strictEqual(newBlogAdded.likes, newBlog.likes)

    await api
      .delete(`/api/blogs/${newBlogAdded.id}`)
      .expect(204)

    const finalResponse = await api.get('/api/blogs')
    assert.strictEqual(finalResponse.body.length, response.body.length - 1)
  })
})

describe('updating a blog', () => {
  test('when a blog can be updated return 200 and update the data', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedBlogData = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)

    const blogsAtEnd = await api.get('/api/blogs')
    const updatedBlog = blogsAtEnd.body.find(blog => blog.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.title, updatedBlogData.title)
    assert.strictEqual(updatedBlog.author, updatedBlogData.author)
    assert.strictEqual(updatedBlog.url, updatedBlogData.url)
    assert.strictEqual(updatedBlog.likes, updatedBlogData.likes)
  })

  text('when updating a non-existing blog return 404', async () => {
    const validNonExistingId = new mongoose.Types.ObjectId()

    const updatedBlogData = {
      title: 'Non-existing blog', 
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5
    }

    await api
      .put(`/api/blogs/${validNonExistingId}`)
      .send(updatedBlogData)
      .expect(404)
  })
})

after(async () => {
  await mongoose.connection.close()
})