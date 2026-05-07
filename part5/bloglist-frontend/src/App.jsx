import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import { notificationStyleSuccess, notificationStyleError } from './stylesConstatns'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState({})

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationStyle(notificationStyleSuccess)
      setNotificationMessage(`Welcome ${user.name}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch {
      setNotificationStyle(notificationStyleError)
      setNotificationMessage('wrong username or password')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const createNewBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotificationStyle(notificationStyleSuccess)
      setNotificationMessage(`a new blog ${returnedBlog.title} added`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch {
      setNotificationStyle(notificationStyleError)
      setNotificationMessage('error adding blog')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (id, blogObject) => {
    blogObject.likes += 1
    const updatedBlog = await blogService.update(id, blogObject)
    setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlog).sort((a, b) => b.likes - a.likes))
  }

  const deleteBlog = async (id) => {
    await blogService.remove(id)
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const logOutForm = () => (
    <form onSubmit={handleLogOut}>
      <div>
        {user.name} logged in
        <button type="submit">logout</button>
      </div>
    </form>
  )

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} notificationStyle={notificationStyle} />
      { user !== null && logOutForm() }
      { user === null &&
      <Togglable buttonLabel="login">
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      </Togglable>
      }
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm
          createNewBlog={createNewBlog}
        />
      </Togglable>
      <br />
      { user !== null && blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={deleteBlog} />
      )}
    </div>
  )
}

export default App