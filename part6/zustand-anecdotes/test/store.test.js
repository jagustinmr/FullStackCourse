// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('../src/service/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    deleteAnecdote: vi.fn(),
  }
}))

import anecdotesService from '../src/service/anecdotes'
import { useAnecdoteStore, useAnecdotes, useAnecdoteActions } from '../src/store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '', notification: '' })
  vi.clearAllMocks()
})

describe('anecdote store', () => {
  it('initializes the state with the anecdotes returned by the backend', async () => {
    const backendAnecdotes = [
      { id: 1, content: 'First anecdote', votes: 0 },
      { id: 2, content: 'Second anecdote', votes: 3 }
    ]

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize(backendAnecdotes)
    })

    expect(useAnecdoteStore.getState().anecdotes).toEqual(backendAnecdotes)
  })

  it('provides anecdotes sorted by votes to the list component', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: 1, content: 'First', votes: 1 },
        { id: 2, content: 'Second', votes: 5 },
        { id: 3, content: 'Third', votes: 3 }
      ]
    })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toEqual([
      { id: 2, content: 'Second', votes: 5 },
      { id: 3, content: 'Third', votes: 3 },
      { id: 1, content: 'First', votes: 1 }
    ])
  })

  it('filters the anecdote list according to the current filter', () => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: 1, content: 'React', votes: 1 },
        { id: 2, content: 'Zustand', votes: 2 }
      ],
      filter: 'react'
    })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toEqual([{ id: 1, content: 'React', votes: 1 }])
  })

  it('increases the number of votes for an anecdote', async () => {
    const anecdote = { id: 1, content: 'React', votes: 1 }
    useAnecdoteStore.setState({ anecdotes: [anecdote] })
    anecdotesService.update.mockResolvedValue({ ...anecdote, votes: 2 })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.vote(anecdote)
    })

    expect(useAnecdoteStore.getState().anecdotes[0].votes).toBe(2)
  })
})
