const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'password'
    }
    await request.post('http://localhost:3001/api/users', { data: newUser })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.click('text=login')
    await expect(page.locator('input[name="username"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[name="loginButton"]')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.click('text=login')
      await page.fill('input[name="username"]', 'Test')
      await page.fill('input[name="password"]', 'defaultPassword')
      await page.click('button[name="loginButton"]')
      await expect(page.locator('text=Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.click('text=login')
      await page.fill('input[name="username"]', 'testuser')
      await page.fill('input[name="password"]', 'wrongpassword')
      await page.click('button[name="loginButton"]')
      await expect(page.locator('text=wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {

    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173')
      await page.click('text=login')
      await page.fill('input[name="username"]', 'Test')
      await page.fill('input[name="password"]', 'defaultPassword')
      await page.click('button[name="loginButton"]')
    })

    // test('a new blog can be created', async ({ page }) => {
    //   await page.click('text=new blog')
    //   await page.fill('input[name="title"]', 'Test Blog testing playwright')
    //   await page.fill('input[name="author"]', 'Author Name')
    //   await page.fill('input[name="url"]', 'http://test.com')
    //   await page.click('button[name="createNewBlogButton"]')

    //   const blog = page.locator('.blog').last()
    //   await expect(blog).toBeVisible()
    //   await expect(blog).toHaveText(/Test Blog/)
    //   await expect(blog).toHaveText(/Author Name/)
    // })

    test('a blog can be edited (likes incremented)', async ({ page }) => {
      await page.click('text=new blog')
      await page.fill('input[name="title"]', 'Test Blog testing playwright')
      await page.fill('input[name="author"]', 'Author Name')
      await page.fill('input[name="url"]', 'http://test.com')
      await page.click('button[name="createNewBlogButton"]')

      const blog = page.locator('.blog').last()
      await blog.getByRole('button', { name: /view/i }).click()
      await blog.getByRole('button', { name: /like/i }).click()
    })

  test('a blog can be deleted by its creator', async ({ page, request }) => {
  const loginResponse = await request.post('http://localhost:3003/api/login', {
    data: {
      username: 'Test',
      password: 'defaultPassword'
    }
  })
  const user = await loginResponse.json()
  const date = new Date().toISOString()

  await page.evaluate((user) => {
    console.log('Setting localStorage with user:', user) // DEBUG
    localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
  }, user)

  await page.goto('http://localhost:5173')

      await page.click('text=new blog')
      await page.fill('input[name="title"]', `Test playwright for delete ${date}`)
      await page.fill('input[name="author"]', 'Author Name for delete')
      await page.fill('input[name="url"]', 'http://test.delete.com')
      await page.click('button[name="createNewBlogButton"]')
      await expect(page.locator('text=Test User logged in')).toBeVisible()

  const blogToDelete = page.locator('.blog').filter({
  hasText: `Test playwright for delete ${date}`
}).first()
  await expect(blogToDelete).toBeVisible()

  page.once('dialog', dialog => dialog.accept())

  await blogToDelete.getByRole('button', { name: /view/i }).click()
  await blogToDelete.getByRole('button', { name: /remove/i }).click()

  await expect(page.locator('.blog').filter({
    hasText: `Test playwright for delete ${date}`
  })).toHaveCount(0)
})

  test('only creator sees delete button', async ({ page, request }) => {
  const loginResponse = await request.post('http://localhost:3003/api/login', {
    data: {
      username: 'Test',
      password: 'defaultPassword'
    }
  })
  const user = await loginResponse.json()

  await page.evaluate((user) => {
    localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
  }, user)

  await page.goto('http://localhost:5173')

    await page.click('text=new blog')
    await page.fill('input[name="title"]', 'Test Blog private delete button')
    await page.fill('input[name="author"]', 'Author Name private delete button')
    await page.fill('input[name="url"]', 'http://test.private.com')
    await page.click('button[name="createNewBlogButton"]')

    await page.click('text=logout')

    await page.click('text=login')
    await page.fill('input[name="username"]', 'other')
    await page.fill('input[name="password"]', 'password')
    await page.click('button[name="loginButton"]')

    const blog = page.locator('.blog').filter({
      hasText: 'Test Blog private delete button'
    }).first()

    await expect(blog).toBeVisible()

    await blog.getByRole('button', { name: /view/i }).click()

    await expect(blog.getByRole('button', { name: /remove/i })).toHaveCount(0)
  })

    test('blogs are ordered by likes', async ({ page }) => {
      await page.click('text=new blog')
      await page.fill('input[name="title"]', 'First')
      await page.fill('input[name="author"]', 'A1')
      await page.fill('input[name="url"]', 'http://1.com')
      await page.click('button[name="createNewBlogButton"]')
    
      const firstBlog = await page.locator('.blog').last()

      await page.click('text=new blog')
      await page.fill('input[name="title"]', 'Second')
      await page.fill('input[name="author"]', 'A2')
      await page.fill('input[name="url"]', 'http://2.com')
      await page.click('button[name="createNewBlogButton"]')

      const secondBlog = await page.locator('.blog').last()


      await firstBlog.getByRole('button', { name: /view/i }).click()
      await secondBlog.getByRole('button', { name: /view/i }).click()

      await firstBlog.locator('button[name="like"]').click()
      await firstBlog.locator('button[name="like"]').click()
      await secondBlog.locator('button[name="like"]').click()
      await secondBlog.locator('button[name="like"]').click()
      await secondBlog.locator('button[name="like"]').click()

      const blogTitles = await page.locator('.blog').allTextContents()
      expect(blogTitles.findIndex((title) => title.includes('Second'))).toBeLessThan(blogTitles.findIndex((title) => title.includes('First')))
    })
  })
})
