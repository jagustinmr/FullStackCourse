import { createContext, useContext, useEffect, useState } from 'react'

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (!notification) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setNotification('')
    }, 5000)

    return () => window.clearTimeout(timeoutId)
  }, [notification])

  const notify = (message) => {
    setNotification(message)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotify = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotify must be used inside a NotificationContextProvider')
  }

  return context
}
