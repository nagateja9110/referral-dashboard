import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="not-found-page">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/">← Back to dashboard</Link>
    </main>
  );
}
