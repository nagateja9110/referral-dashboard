import { useState } from 'react';
import Cookies from 'js-cookie';
import { Navigate, useNavigate } from 'react-router-dom';
import { signIn } from '../api';

export default function Login() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const navigate = useNavigate();

  if (Cookies.get('jwt_token')) {
    return <Navigate to="/" replace />;
  }

  function toggleMode() {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setError('');
    setNotice('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setNotice('');

    if (mode === 'signup') {
      setNotice('Sign-up isn’t available yet — please contact an admin for account access.');
      return;
    }

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
        <p className="tagline">
          {mode === 'signin'
            ? 'Sign in to open your referral dashboard.'
            : 'Create an account to get started.'}
        </p>
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
          {notice && (
            <p className="login-notice" role="status">
              {notice}
            </p>
          )}
          <button type="submit">{mode === 'signin' ? 'Sign in' : 'Sign up'}</button>
        </form>
        <p className="auth-toggle">
          {mode === 'signin' ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" className="link-button" onClick={toggleMode}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="link-button" onClick={toggleMode}>
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
