import { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function LoginRegister() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signInWithGoogle, error: authError } = useContext(AuthContext)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)

    try {
      await signInWithGoogle()
      const from = location.state?.from?.pathname || '/'
      navigate(from)
    } catch (err) {
      setError(err.message || authError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-darkest)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 400, background: 'var(--color-bg-darker)', borderRadius: 12, padding: 40, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8, textAlign: 'center' }}>
          🔐 Sign In
        </h1>
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: 32, fontSize: 14 }}>
          Sign in to track your learning progress
        </p>

        {error && (
          <div style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid #f87171', borderRadius: 8, padding: 12, marginBottom: 20, color: '#fca5a5', fontSize: 14 }}>
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.15)',
            color: 'var(--color-text)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: loading ? 0.7 : 1,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.8 }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted)', fontSize: 12, textAlign: 'center', lineHeight: 1.6 }}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  )
}
