import { useState } from 'react'

const BlogForm = ({ createNewBlog }) => {
  const [newBlog, setNewBlog] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog,
      author: newAuthor,
      url: newUrl
    }
    await createNewBlog(blogObject)
    setNewBlog('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <label>
          title
          <input name="title"
            value={newBlog}
            onChange={handleBlogChange}
          />
        </label>
      </div>
      <div>
        <label>
      author
          <input name="author"
            value={newAuthor}
            onChange={handleAuthorChange}
          />
        </label>
      </div>
      <div>
        <label>
      url
          <input name="url"
            value={newUrl}
            onChange={handleUrlChange}
          />
        </label>
      </div>
      <button type="submit" name="createNewBlogButton">save</button>
    </form>
  )
}

export default BlogForm

