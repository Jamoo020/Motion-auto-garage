import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header>
      <div className="brand">
        <img src="/images/motion.png" alt="Motion Auto Garage Ltd" className="logo" />
        <strong>MOTION AUTO GARAGE LTD.</strong>
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/contacts">Contacts</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
}

export default Header;