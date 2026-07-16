import { render, screen } from '@testing-library/react'
import Blog from '../src/components/Blog'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from '../src/components/BlogForm'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Jest and Vitest',
    url: 'www.test.com',
    likes: 5,
    user: {
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} />)

  const elementTitle = screen.getByText(/component testing is done with react-testing-library/i)
  const elementAuthor = screen.getByText(/jest and vitest/i)
  expect(elementTitle).toBeDefined()
  expect(elementAuthor).toBeDefined()
})

test('shows url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'www.test.com',
    likes: 5,
    user: {
      name: 'Test User',
    },
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('www.test.com')).toBeInTheDocument()
  expect(screen.getByText(/likes/i)).toBeInTheDocument()
  expect(screen.getByText(/likes\s+5/i)).toBeInTheDocument()
})

test('if like button is clicked twice, the event handler is called twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'www.test.com',
    likes: 5,
    user: {
      name: 'Test User',
    },
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('calls event handler with correct details when a new blog is created', async () => {
  const createNewBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createNewBlog={createNewBlog} />)

  await user.type(screen.getByLabelText('title'), 'Testing React forms')
  await user.type(screen.getByLabelText('author'), 'Test Author')
  await user.type(screen.getByLabelText('url'), 'www.test.com')
  await user.click(screen.getByText('save'))

  expect(createNewBlog).toHaveBeenCalledTimes(1)
  expect(createNewBlog.mock.calls[0][0]).toEqual({
    title: 'Testing React forms',
    author: 'Test Author',
    url: 'www.test.com',
  })
})