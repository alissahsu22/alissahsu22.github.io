import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './VerifyAdmin.css'

function VerifyAdmin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post('http://localhost:4000/verify-admin', { password })
      if (res.data.success) {
        localStorage.setItem('isAdminVerified', 'true')
        navigate('/admin')
      }
    } catch (err) {
      console.error(err)
      setError('Incorrect admin password')
    }
  }

  return (
    <div className="admin-login-container">
      <form onSubmit={handleSubmit} className="admin-login-form">
        <h2>Admin Access</h2>
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Enter</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  )
}

export default VerifyAdmin
