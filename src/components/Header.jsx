import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <>
      <header className={scrolled ? 'scrolled' : ''}>
        <div className="brand">
          <img src="/images/motion.png" alt="Motion Auto Garage Ltd" className="logo" />
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
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</Link>
          <Link to="/contacts" onClick={() => setMenuOpen(false)}>Contacts</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
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