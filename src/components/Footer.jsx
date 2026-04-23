import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>&copy; {year} Motion Auto Garage Ltd — All rights reserved</footer>
  );
}

export default Footer;