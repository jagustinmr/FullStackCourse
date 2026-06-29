import {useAnecdotes} from '../store'
import { useAnecdoteActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const actions = useAnecdoteActions()
  const vote = (anecdote) => {
        actions.vote(anecdote)
 }

 const deleteAnecdote = (anecdote) => {
    actions.deleteAnecdote(anecdote)
  }

  return (
    <div>
    {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
            {anecdote.votes === 0 ? <button onClick={() => deleteAnecdote(anecdote)}>delete</button> : null}
            </div>
          </div>
          
      ))}
    </div>
  )
}

export default AnecdoteList