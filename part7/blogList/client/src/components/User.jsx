import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const User = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get(`/api/users/${id}`).then((response) => setUser(response.data))
  }, [id])

  if (!user) {
    return null
  }

  return (
    <div>
      <h3>{user.name}</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
