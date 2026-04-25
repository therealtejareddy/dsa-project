import { createContext, useState, useEffect } from 'react'
import { auth } from '../config/firebase'
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [firebaseReady, setFirebaseReady] = useState(!!auth)

  // Track auth state changes
  useEffect(() => {
    if (!auth) {
      setLoading(false)
      setFirebaseReady(false)
      return
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser)
        setLoading(false)
      })
      return unsubscribe
    } catch (err) {
      console.error('Auth state change error:', err)
      setLoading(false)
    }
  }, [])

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error('Firebase not configured. Please set environment variables.')
    }
    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Logout
  const logout = async () => {
    if (!auth) {
      throw new Error('Firebase not configured.')
    }
    try {
      setError(null)
      await signOut(auth)
      setUser(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        logout,
        isAuthenticated: !!user,
        firebaseReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
