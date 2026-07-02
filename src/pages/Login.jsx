import { useState } from 'react';
import Cookies from 'js-cookie';
import { Navigate, useNavigate } from 'react-router-dom';
import { signIn } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (Cookies.get('jwt_token')) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const responseJson = await signIn(email, password);
      const token = responseJson.data.token;
      Cookies.set('jwt_token', token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <h1 className="brand-title">Go Business</h1>
        <p className="tagline">Sign in to open your referral dashboard.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit">Sign in</button>
        </form>
      </div>
    </main>
  );
}
