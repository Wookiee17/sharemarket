import React, { useState } from "react";
// import PropTypes from "prop-types";

// icons
import { FiMenu } from "react-icons/fi";

// rdeux
import { useSelector } from "react-redux";

const HamburgerMenu = ({}) => {
  const theme = useSelector((state) => state.Common.theme);
  const [open, setOpen] = useState(false);
  return (
    <div className={`hamburger ${theme}`}>
      <div
        className={`hamburger_btn ${theme} ${open && "active"}`}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <FiMenu />
      </div>
      <aside className={`${theme} ${open && "active"}`}>
        <ul>
          <li>Side Menu</li>
        </ul>
      </aside>
    </div>
  );
};

export default HamburgerMenu;
