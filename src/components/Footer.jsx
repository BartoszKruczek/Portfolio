import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Kolumna 1: Branding */}
        <div className="footer-section">
          <h2 className="footer-logo">TECH-SHOP</h2>
          <p>Twój zaufany dostawca nowoczesnej elektroniki. Jakość, której możesz dotknąć.</p>
          <div className="social-icons">
            <span>FB</span> <span>IG</span> <span>TW</span>
          </div>
        </div>

        {/* Kolumna 2: Szybkie linki */}
        <div className="footer-section">
          <h4>Sklep</h4>
          <ul>
            <li><Link to="/">Strona Główna</Link></li>
            <li><Link to="/about">O nas & FAQ</Link></li>
            <li><Link to="/login">Konto użytkownika</Link></li>
          </ul>
        </div>

        {/* Kolumna 3: Kontakt */}
        <div className="footer-section">
          <h4>Kontakt</h4>
          <ul>
            <li>Email: kontakt@tech-shop.pl</li>
            <li>Tel: +48 123 456 789</li>
            <li>Adres: ul. Cyfrowa 1, Warszawa</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TECH-SHOP. Wszystkie prawa zastrzeżone.</p>
      </div>
    </footer>
  );
}

export default Footer;
