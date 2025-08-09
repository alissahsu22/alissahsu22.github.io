import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

export const useNotification = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState(null)

  const showNotification = (msg, duration = 2000) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), duration)
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {message && (
        <div className="toast">{message}</div>
      )}
    </NotificationContext.Provider>
  )
}
