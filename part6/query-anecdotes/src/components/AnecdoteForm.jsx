import { useAnecdotes } from '../hooks/useAnecdotes'

const AnecdoteForm = () => {
  const { createAnecdote } = useAnecdotes()

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value.trim()
    event.target.reset()

    if (content.length >= 5) {
      await createAnecdote(content)
    }
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm