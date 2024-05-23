import React from "react";
import "./Footer.scss";
import { footerArray } from "./footerArray";

// Define a type for the items in footerArray
interface FooterIcon {
  href: string;
  src: string;
}

const Footer: React.FC = () => {
  return (
    <div className="footer flexCenter">
      <h4>© 2024 | Designed and developed by Mozaffar Mohammad</h4>
      <div className="social-icons flexCenter">
        {footerArray.map((icon: FooterIcon, index: number) => {
          return (
            <a href={icon.href} target="_blank" rel="noopener noreferrer" key={index}>
              <img src={icon.src} alt={`icon-${index}`} />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
