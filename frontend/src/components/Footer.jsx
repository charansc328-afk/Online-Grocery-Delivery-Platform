import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">QUICKCART</div>
            <p className="footer-desc">
              Your favorite online grocery platform. Fresh essentials delivered to your doorstep in minutes.
            </p>
          </div>
          
          <div>
            <h3 className="footer-heading">Company</h3>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="footer-heading">Help</h3>
            <ul className="footer-links">
              <li><a href="#">Customer Support</a></li>
              <li><a href="#">Delivery Policies</a></li>
              <li><a href="#">Returns & Refunds</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="footer-heading">Legal</h3>
            <ul className="footer-links">
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 QuickCart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
