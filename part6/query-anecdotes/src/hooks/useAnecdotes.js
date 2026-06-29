import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../services/anecdotes'
import { useNotify } from '../NotificationContext'

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { notify } = useNotify()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAnecdotes,
    retry: false,
  })

  const createAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (oldData = []) => [...oldData, newAnecdote])
      notify(`new anecdote '${newAnecdote.content}' created`)
    },
    onError: () => {
      notify('too short anecdote, must have length 5 or more')
    },
  })

  const voteAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (oldData = []) =>
        oldData.map((anecdote) => (anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote))
      )
      notify(`you voted for '${updatedAnecdote.content}'`)
    },
  })

  return {
    ...result,
    createAnecdote: createAnecdoteMutation.mutateAsync,
    voteAnecdote: voteAnecdoteMutation.mutateAsync,
  }
}
