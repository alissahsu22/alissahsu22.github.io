import { useState } from "react";
import "./Account.css";
import { useNavigate } from "react-router-dom";
import api from "../api";          // ⬅ use the client
import { useUser } from "../context/UserContext";

function Account() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await api.post("/login", { email, password }); // ⬅ fixed
      if (res.data?.success) {
        setUser(res.data.user);
        navigate("/");
      } else {
        setErr("Invalid email or password.");
      }
    } catch (e) {
      console.error(e);
      setErr("Couldn't log in. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
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

        <button type="submit">Log In</button>

        <p className="signUp" style={{ fontSize: '0.9rem' }}>
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            style={{ color: 'blue', cursor: 'pointer' }}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  )
}

export default Account
