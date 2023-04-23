import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";

// redux
import { useSelector } from "react-redux";

const HeaderLinks = ({ lable, link, isBage, bageNo, isLink, handleClick }) => {
  const theme = useSelector((state) => state.Common.theme);
  return (
    <>
      {isLink ? (
        <Link href={link ? link : "/"} className="HeaderLinks">
          <div className={`HeaderLinks_inner ${theme}`}>
            {isBage && <div className="HeaderLinks_Bage">{bageNo}</div>}
            <span>{lable}</span>
          </div>
        </Link>
      ) : (
        <span className="HeaderLinks" onClick={handleClick}>
          <div className={`HeaderLinks_inner ${theme}`}>
            {isBage && <div className="HeaderLinks_Bage">{bageNo}</div>}
            <span>{lable}</span>
          </div>
        </span>
      )}
    </>
  );
};

HeaderLinks.propTypes = {
  lable: PropTypes.string,
  link: PropTypes.string,
  isBage: PropTypes.bool,
  bageNo: PropTypes.string,
};

export default HeaderLinks;
