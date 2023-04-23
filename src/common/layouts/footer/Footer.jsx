import React from "react";

// redux
import { useSelector } from "react-redux";

const Footer = () => {
  const theme = useSelector((state) => state.Common.theme);
  return (
    <footer className={`footer ${theme}`}>Info Panel - News, Alerts etc</footer>
  );
};

export default Footer;
