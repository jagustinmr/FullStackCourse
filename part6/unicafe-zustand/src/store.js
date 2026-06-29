import { create } from 'zustand'

const useCounterStore = create(set => ({
  good: 0,
  neutral: 0,
  bad: 0,
  all: 0,
  average: 0,
  positive: 0,
  actions: {
    good: () => set(state => ({ good: state.good + 1, all: state.all + 1, average: (state.average * state.all + 1) / (state.all + 1), positive: (state.positive * state.all + 1) / (state.all + 1) })),
    neutral: () => set(state => ({ neutral: state.neutral + 1, all: state.all + 1, average: (state.average * state.all + 0) / (state.all + 1), positive: (state.positive * state.all + 0) / (state.all + 1) })),
    bad: () => set(state => ({ bad: state.bad + 1, all: state.all + 1, average: (state.average * state.all - 1) / (state.all + 1), positive: (state.positive * state.all + 0) / (state.all + 1) })),
    zero: () => set(() => ({ good: 0, neutral: 0, bad: 0, all: 0, average: 0, positive: 0 })),
  }  
}))

// the hook functions that are used elsewhere in app
export const useGood = () => useCounterStore(state => state.good)
export const useNeutral = () => useCounterStore(state => state.neutral)
export const useBad = () => useCounterStore(state => state.bad)
export const useAll = () => useCounterStore(state => state.all)
export const useAverage = () => useCounterStore(state => state.average)
export const usePositive = () => useCounterStore(state => state.positive)
export const useCounterControls = () => useCounterStore(state => state.actions)