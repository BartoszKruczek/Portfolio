import { Link } from 'react-router-dom';

function Navbar({ cartCount, user, onLogout, toggleTheme, currentTheme }) {
  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 style={{ color: 'var(--accent)', fontWeight: '800' }}>TECH-SHOP</h2>
      </Link>
      
      <div className="nav-right">
        <ul className="navbar-links">
          <li><Link to="/">Sklep</Link></li>
          <li><Link to="/about">Pomoc</Link></li>
          {user ? (
            <li><Link to="/login" style={{color: 'var(--accent)'}}>Moje Konto</Link></li>
          ) : (
            <li><Link to="/login">Zaloguj</Link></li>
          )}
        </ul>

        <button className="theme-toggle" onClick={toggleTheme} style={{
          background: 'none', border: '1px solid var(--border)', 
          cursor: 'pointer', borderRadius: '50%', width: '40px', height: '40px'
        }}>
          {currentTheme === 'light' ? '🌙' : '☀️'}
        </button>

        <Link to="/cart" style={{ textDecoration: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{fontSize: '1.2rem'}}>🛒</span>
          <span style={{
            background: 'var(--accent)', color: '#000', 
            padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold'
          }}>
            {cartCount}
          </span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;