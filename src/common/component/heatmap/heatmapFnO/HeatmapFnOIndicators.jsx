import React from "react";
import PropTypes from "prop-types";
// redux
import { useSelector } from "react-redux";

const HeatmapFnOIndicators = ({
  topNum,
  percentage,
  level,
  onClick,
  active,
}) => {
  const theme = useSelector((state) => state.Common.theme);
  return (
    <div className="indicators" onClick={onClick}>
      <div className={`top ${theme} ${active == true ? "active" : "passive"}`}>
        {topNum}
      </div>
      <div
        className={`bar ${level} ${active == true ? "active" : "passive"}`}
      ></div>
      <div
        className={`percentage ${theme} ${
          active == true ? "active" : "passive"
        }`}
      >
        {percentage}
      </div>
    </div>
  );
};

HeatmapFnOIndicators.propTypes = {
  topNum: PropTypes.number,
  percentage: PropTypes.string,
  level: PropTypes.string,
};
export default HeatmapFnOIndicators;
