import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>About</h3>
          <ul>
            <li><Link to="/about">About us</Link></li>
            <li><Link to="/about">Team</Link></li>
            <li><Link to="/about">Staff</Link></li>
            <li><Link to="/contacts">Book appointment</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Content</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/contacts">Contacts</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Connect</h3>
          <ul>
            <li><a href="tel:+254712345678">Call us</a></li>
            <li><a href="mailto:info@motionautogarage.co.ke">Email</a></li>
            <li><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} Motion Auto Garage Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;