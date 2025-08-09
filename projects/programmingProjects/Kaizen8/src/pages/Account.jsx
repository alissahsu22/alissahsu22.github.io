import { useState } from 'react'
import './Account.css'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import { useUser } from '../context/UserContext'

function Account() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { setUser } = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/login', { email, password })
      if (res.data?.success) {
        const loggedInUser = res.data.user
        localStorage.setItem('user', JSON.stringify(loggedInUser))
        setUser(loggedInUser)
        alert('✅ Login successful!')
        navigate('/')
      } else {
        alert('❌ Invalid credentials')
      }
    } catch (err) {
      console.error('Login failed:', err)
      alert('❌ Login error')
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input type="email" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Log In</button>
        <p className="signUp" style={{ fontSize: '0.9rem' }}>
          Don’t have an account?{' '}
          <span onClick={() => navigate('/signup')} style={{ color: 'blue', cursor: 'pointer' }}>
            Sign up
          </span>
        </p>
      </form>
    </div>
  )
}
export default Account
