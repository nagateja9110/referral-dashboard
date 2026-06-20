import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    Cookies.remove('jwt_token');
    navigate('/login');
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand" aria-label="Go to dashboard home">
        Go Business
      </Link>
      <nav aria-label="Primary" className="navbar-nav">
        <Link to="/">Home</Link>
      </nav>
      <button type="button" className="logout-button" onClick={handleLogout}>
        Log out
      </button>
    </header>
  );
}
