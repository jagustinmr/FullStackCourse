import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const BlogDetail = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [comment, setComment] = useState('')

  useEffect(() => {
    axios.get(`/api/blogs/${id}`).then((response) => setBlog(response.data))
  }, [id])

  const handleComment = async (event) => {
    event.preventDefault()
    const response = await axios.post(`/api/blogs/${id}/comments`, { content: comment })
    setBlog({ ...blog, comments: blog.comments.concat(response.data) })
    setComment('')
  }

  if (!blog) {
    return null
  }

  return (
    <div>
      <h3>{blog.title}</h3>
      <p>{blog.author}</p>
      <p>{blog.url}</p>
      <p>Likes: {blog.likes}</p>
      <h4>Comments</h4>
      <form onSubmit={handleComment}>
        <input value={comment} onChange={({ target }) => setComment(target.value)} />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments?.map((item, index) => (
          <li key={`${item.content}-${index}`}>{item.content}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogDetail
