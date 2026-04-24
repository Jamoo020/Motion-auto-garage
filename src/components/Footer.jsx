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
            <li><Link to="/about#company-overview">About us</Link></li>
            <li><Link to="/about#company-values">Company Values</Link></li>
            <li><Link to="/about#location">Location</Link></li>
            <li><Link to="/contacts#appointment">Book appointment</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Content</h3>
          <ul>
            <li><Link to="/about#company-overview">About us</Link></li>
            <li><Link to="/about#company-values">Company Values</Link></li>
            <li><Link to="/about#location">Location</Link></li>
            <li><Link to="/contacts#appointment">Book appointment</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Connect</h3>
          <ul>
            <li><a href="tel:+254712345678">Call us</a></li>
            <li><a href="mailto:info@motion-auto.co.ke">Email</a></li>
            <li><a href="https://wa.me/254793853771" target="_blank" rel="noreferrer">Whatsapp</a></li>
            <li><a href="https://www.instagram.com/motionautogarage" target="_blank" rel="noreferrer">Instagram</a></li>
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