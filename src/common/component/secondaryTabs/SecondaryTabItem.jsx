import React from "react";
import PropTypes from "prop-types";

// redux
import { useSelector } from "react-redux";

const SecondaryTabItem = ({ options, onClick, active }) => {
  const theme = useSelector((state) => state.Common.theme);

  return <div className="secondary_tabs-item focused">Long Built Up </div>;
};

SecondaryTabItem.prototype = {
  options: PropTypes.array,
  active: PropTypes.number,
  onClick: PropTypes.func,
};

export default SecondaryTabItem;
