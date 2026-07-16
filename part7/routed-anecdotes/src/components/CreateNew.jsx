import { useNavigate } from 'react-router-dom'
import { useAnecdotes, useField } from '../hooks'

const CreateNew = () => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const { addAnecdote } = useAnecdotes()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addAnecdote({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
  }

  const clearFields = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  const { reset: _contentReset, ...contentProps } = content
  const { reset: _authorReset, ...authorProps } = author
  const { reset: _infoReset, ...infoProps } = info

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentProps} name='content' />
        </div>
        <div>
          author
          <input {...authorProps} name='author' />
        </div>
        <div>
          url for more info
          <input {...infoProps} name='info' />
        </div>
        <button type='submit'>create</button>
        <button type='button' onClick={clearFields}>clear</button>
      </form>
    </div>
  )
}

export default CreateNew
