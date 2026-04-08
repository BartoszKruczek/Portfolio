import { Link } from 'react-router-dom';

function Navbar({ cartCount, user, onLogout, toggleTheme, currentTheme }) {
  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2 style={{ color: 'var(--accent)', fontWeight: '800', letterSpacing: '-1px' }}>TECH-SHOP</h2>
      </Link>
      
      <div className="nav-right">
        <ul className="navbar-links" style={{ display: 'flex', listStyle: 'none', gap: '25px', alignItems: 'center' }}>
          <li>
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>
              Sklep
            </Link>
          </li>
          <li>
            <Link to="/about" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>
              Pomoc
            </Link>
          </li>
          
          {/* LOGIKA LOGOWANIA W NAVBARZE */}
          {user ? (
            <li style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>
                Konto
              </Link>
              <button 
                onClick={onLogout} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: 'var(--text-muted)', 
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  padding: '0'
                }}
              >
                Wyloguj
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>
                Zaloguj
              </Link>
            </li>
          )}
        </ul>

        {/* PRZEŁĄCZNIK MOTYWU */}
        <button className="theme-toggle" onClick={toggleTheme} style={{
          background: 'var(--bg-input)', border: '1px solid var(--border)', 
          cursor: 'pointer', borderRadius: '50%', width: '40px', height: '40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {currentTheme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* KOSZYK */}
        <Link to="/cart" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.4rem' }}>🛒</span>
          <span style={{
            background: 'var(--accent)',
            color: '#000',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '0.75rem',
            fontWeight: '800'
          }}>
            {cartCount}
          </span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
