import React from 'react';
import './footer.css';
import { BsFacebook } from "react-icons/bs";
import { FaSquareGithub } from "react-icons/fa6";
import { BsLinkedin } from "react-icons/bs";

const Footer = () => {
  return (
  <footer>
    <div className="footer-content">
        <p>
            &copy; 2024 Your E-Learning Platform. All rights reserved. <br />
            Made with ❤️ by the E-Learning Team.
        </p>
        <div className="social-link">
            <a href="">< BsFacebook /></a>
            <a href=""><  FaSquareGithub /></a>
            <a href="">< BsLinkedin  /></a>
        </div>
    </div>
  </footer>
  )
}

export default Footer