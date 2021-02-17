import { User } from 'firebase'
import { createContext, useEffect, useState } from 'react'
import { auth } from '../utils/firebase'

const AuthContext = createContext

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined)

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }