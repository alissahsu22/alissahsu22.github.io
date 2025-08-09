// src/pages/Signup.jsx
import { useState } from 'react'
import './Account.css' 
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
  e.preventDefault()

  if (password !== confirmPassword) {
    alert('Passwords do not match!')
    return
  }

  try {
    const res = await axios.post('http://localhost:4000/signup', {
      email,
      password,
      name: email.split('@')[0] // or use a real name input if you want
    })

    alert('✅ Account created! You can now log in.')
    navigate('/myAccount')
  } catch (err) {
    console.error('Signup failed:', err)
    alert('❌ Signup failed. Email may already be in use.')
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

        <button type="submit">Create Account</button>
        <p style={{ fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/myAccount')}
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
