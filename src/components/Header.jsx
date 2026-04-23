import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 40;
      setScrolled(isScrolled);
      if (isScrolled) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (to) => {
    setMenuOpen(false);
    // Small delay to ensure menu closes before navigation
    setTimeout(() => {
      navigate(to);
    }, 100);
  };

  return (
    <>
      <header className={scrolled ? 'scrolled' : ''}>
        <div className="brand">
          <img src="/images/motion.svg" alt="Motion Auto Garage Ltd" className="logo" />
          <strong>MOTION AUTO GARAGE LTD.</strong>
        </div>
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="menu-icon">{menuOpen ? '✕' : '☰'}</span>
        </button>
        <nav className={menuOpen ? 'open' : ''}>
          <Link to="/" onClick={() => handleNavClick('/')}>Home</Link>
          <Link to="/services" onClick={() => handleNavClick('/services')}>Services</Link>
          <Link to="/gallery" onClick={() => handleNavClick('/gallery')}>Gallery</Link>
          <Link to="/contacts" onClick={() => handleNavClick('/contacts')}>Contacts</Link>
          <Link to="/about" onClick={() => handleNavClick('/about')}>About</Link>
        </nav>
      </header>
      <div
        className={`drawer-backdrop ${menuOpen ? 'visible' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
    </>
  );
}

export default Header;