import { useState } from 'react'

const Title = ({ text }) => {
  return (
    <>
      <h1>{text}</h1>
    </>
  )
}

const AnecdotesLine = ({ anecdotes, value }) => {
  if(value === null) { 
    return (
      <>
          No anecdotes yet
      </> 
    )
  }
  return (
    <>
        {anecdotes[value]}
    </>
  )
}

const ShowVotes = ({ votes, selected }) => {
  return (
    <>
      <p>has {votes[selected]} votes</p>
    </>
  )
}

const Button = ({ onClick, text }) => {
  return (
    <>
      <button onClick={onClick}>{text}</button>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const OnSelectedClick = () => {
    const randomNumber = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomNumber)
  }

  const OnVoteClick = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  return (
    <div>
      <Title text="Anecdote of the day" />
      <AnecdotesLine anecdotes={anecdotes} value={selected} />
      <ShowVotes votes={votes} selected={selected} />
      <Button onClick={OnVoteClick} text="vote" />
      <Button onClick={OnSelectedClick} text="next anecdote" />
      <Title text="Anecdote with most votes" />
      <AnecdotesLine anecdotes={anecdotes} value={votes.indexOf(Math.max(...votes))} />
      <ShowVotes votes={votes} selected={votes.indexOf(Math.max(...votes))} />
    </div>
  )
}

export default App