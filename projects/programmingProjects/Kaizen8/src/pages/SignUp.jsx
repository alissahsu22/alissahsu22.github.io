// src/pages/Signup.jsx
import { useState } from 'react'
import './Account.css'
import { useNavigate } from 'react-router-dom'
import api from '../api'   // ✅ use the centralized axios instance

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')

    if (password !== confirmPassword) {
      setErr('Passwords do not match!')
      return
    }

    try {
      await api.post('/signup', {
        email,
        password,
        name: email.split('@')[0] // or add a separate "name" input
      })

      alert('✅ Account created! You can now log in.')
      navigate('/myAccount') // keep this if your route is /myAccount; otherwise use /account
    } catch (error) {
      console.error('Signup failed:', error)
      setErr('❌ Signup failed. Email may already be in use.')
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {err && <div className="error" style={{ marginTop: 8 }}>{err}</div>}

        <button type="submit">Create Account</button>
        <p style={{ fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/myAccount')} // or '/account' to match your route
            style={{ color: 'blue', cursor: 'pointer' }}
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  )
}

export default Signup
