
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import anecdotesService  from './service/anecdotes'

// eslint-disable-next-line no-unused-vars
const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const sortByVotes = (anecdotes) => [...anecdotes].sort((a, b) => b.votes - a.votes)

export const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: '',
  notification: '',
  actions: {
    vote: async(anecdote) => {
      const votedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1
      }
      await anecdotesService.update(votedAnecdote.id, votedAnecdote)
      set((state) => ({
        notification: `Anecdote voted: ${votedAnecdote.content}`,
        anecdotes: sortByVotes(state.anecdotes.map(a => a.id === votedAnecdote.id ? votedAnecdote : a))
      }))
    },
    create: async (content) => {
      const newAnecdote = asObject(content)
      const createdAnecdote = await anecdotesService.create(newAnecdote)
      set({ notification: `Anecdote created: ${newAnecdote.content}` })
      set((state) => {
      return {
        anecdotes: [...state.anecdotes, createdAnecdote]
      }
    })},
    setFilter: (value) => set(() => ({ filter: value })),
    initialize: (anecdotes) => set(() => ({ anecdotes })),
    deleteAnecdote: async (anecdote) => {
      await anecdotesService.deleteAnecdote(anecdote.id)
      set({ notification: `Anecdote deleted: ${anecdote.content}` })
      set((state) => {
        return {
          anecdotes: state.anecdotes.filter(a => a.id !== anecdote.id)
        }
      })
    }
  },
}))

export const useAnecdotes = () => useAnecdoteStore(useShallow((state) => {
  const sortedAnecdotes = sortByVotes(state.anecdotes)

  if (!state.filter) {
    return sortedAnecdotes
  }

  return sortedAnecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
}))
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useNotification = () => useAnecdoteStore((state) => state.notification)
