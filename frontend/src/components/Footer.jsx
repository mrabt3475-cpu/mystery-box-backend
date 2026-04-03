import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span>🎁</span> PuzzleChain
            </Link>
            <p>The ultimate mystery box platform. Win amazing prizes every day!</p>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/boxes">Mystery Boxes</Link>
            <Link to="/products">Products</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          
          <div className="footer-links">
            <h4>Support</h4>
            <Link to="/faq">FAQ</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
          
          <div className="footer-links">
            <h4>Contact</h4>
            <a href="mailto:support@puzzlechain.com">support@puzzlechain.com</a>
            <div className="social-links">
              <a href="#">🐦</a>
              <a href="#">📘</a>
              <a href="#">📸</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 PuzzleChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
