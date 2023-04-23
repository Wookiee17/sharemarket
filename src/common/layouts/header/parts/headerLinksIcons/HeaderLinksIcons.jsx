import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";

// redux
import { useSelector } from "react-redux";

const HeaderLinksIcons = ({
  icon,
  link,
  isBage,
  bageNo,
  isLink,
  handleClick,
}) => {
  const theme = useSelector((state) => state.Common.theme);
  return (
    <>
      {isLink ? (
        <Link href={link ? link : "/"} className="HeaderLinksIcons">
          <div className={`HeaderLinksIcons_inner ${theme}`}>
            {isBage && <div className="HeaderLinksIcons_Bage">{bageNo}</div>}
            {icon}
          </div>
        </Link>
      ) : (
        <span className="HeaderLinksIcons" onClick={handleClick}>
          <div className={`HeaderLinksIcons_inner ${theme}`}>
            {isBage && <div className="HeaderLinksIcons_Bage">{bageNo}</div>}
            {icon}
          </div>
        </span>
      )}
    </>
  );
};

HeaderLinksIcons.propTypes = {
  icon: PropTypes.node,
  link: PropTypes.string,
  isBage: PropTypes.bool,
  bageNo: PropTypes.string,
};

export default HeaderLinksIcons;
