import { useState } from 'react'
import persistentUser from '../services/persistentUser'

const Blog = ({ blog, updateBlog, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const loggedUser = persistentUser.getUser()
  const isCreator = blog.user && loggedUser && blog.user.username === loggedUser.username

  const blogVisibilityDetails = () => {
    setVisible(!visible)
  }

  const removeBlogConfirm = () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      return removeBlog(blog.id)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='blog-card'>
      <strong>{blog.title}</strong> by {blog.author}
      <button name="view" style={hideWhenVisible} onClick={blogVisibilityDetails}>view</button>
      <div style={showWhenVisible} className="blogDetails">
        <div>{blog.url}</div>
        <div name="likes">{blog.likes} <button name="like" onClick={() => updateBlog(blog.id, blog)}>like</button></div>
        <div>added by {blog.user && blog.user.name}</div>
        <div className="blog-actions">
          <button className="secondary" onClick={blogVisibilityDetails}>hide</button>
          {isCreator && (
            <button name="remove" onClick={removeBlogConfirm}>
              remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Blog