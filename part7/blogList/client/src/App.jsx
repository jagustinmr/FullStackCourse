import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import { notificationStyleSuccess, notificationStyleError } from './stylesConstatns'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import persistentUser from './services/persistentUser'
import useField from './hooks/useField'
import Users from './components/Users'
import User from './components/User'
import BlogDetail from './components/BlogDetail'
import './styles.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationStyle, setNotificationStyle] = useState({})
  const username = useField('text')
  const password = useField('password')
  const blogFormRef = useRef()

  useEffect(() => {
    const storedUser = persistentUser.getUser()
    if (storedUser) {
      setUser(storedUser)
      blogService.setToken(storedUser.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({
        username: username.value,
        password: password.value,
      })

      blogService.setToken(loggedUser.token)
      persistentUser.saveUser(loggedUser)
      setUser(loggedUser)
      username.reset()
      password.reset()
      setNotificationStyle(notificationStyleSuccess)
      setNotificationMessage(`Welcome ${loggedUser.name}`)
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
    const updatedBlog = await blogService.update(id, { ...blogObject, likes: blogObject.likes + 1 })
    setBlogs(blogs.map(blog => (blog.id !== id ? blog : updatedBlog)).sort((a, b) => b.likes - a.likes))
  }

  const deleteBlog = async (id) => {
    await blogService.remove(id)
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const handleLogOut = () => {
    persistentUser.removeUser()
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
    <Router>
      <div className="app-shell">
        <h2>blogs</h2>
        <Notification message={notificationMessage} notificationStyle={notificationStyle} />
        <nav>
          <Link to="/">blogs</Link>
          <Link to="/users">users</Link>
        </nav>
        {user !== null && logOutForm()}
        {user === null && (
          <Togglable buttonLabel="login">
            <LoginForm
              handleSubmit={handleLogin}
              handleUsernameChange={username.onChange}
              handlePasswordChange={password.onChange}
              username={username.value}
              password={password.value}
            />
          </Togglable>
        )}
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createNewBlog={createNewBlog} />
        </Togglable>
        <br />
        <Routes>
          <Route path="/" element={user !== null && blogs.map(blog => <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={deleteBlog} />)} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App