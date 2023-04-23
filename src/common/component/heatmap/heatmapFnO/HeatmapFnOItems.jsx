import React from "react";
import { Popover } from "antd";
import PropTypes from "prop-types";

// redux
import { useSelector } from "react-redux";

const HeatmapFnOItems = ({ name, qnt, perc }) => {
  // console.log(name, qnt, perc, "test comp");
  const theme = useSelector((state) => state.Common.theme);

  return (
    <Popover
      content={() => (
        <>
          <p>{qnt}</p>
          <p>{perc == 0 ? 0?.toFixed(2) : perc}%</p>
        </>
      )}
      title={name}
      // color={'#353a48'}
      // style={{color: '#fff'}}
      placement="topLeft"
    >
      <div
        className={`item 
        ${
          perc == 0
            ? "n"
            : perc > 5
            ? "g1"
            : perc <= 5 && perc > 2
            ? "g2"
            : perc <= 2 && perc > 0
            ? "g3"
            : perc < 0 && perc >= -2
            ? "d1"
            : perc < -2 && perc >= -5
            ? "d2"
            : perc < -5
            ? "d3"
            : ""
        }
         ${theme}`}
      >
        <div className="name">{name}</div>
        <div className="percentage">{qnt}</div>
        <div className="quantity">{perc == 0 ? 0?.toFixed(2) : perc}%</div>
      </div>
    </Popover>
  );
};

HeatmapFnOItems.proptypes = {
  name: PropTypes.string,
  qnt: PropTypes.number,
  perc: PropTypes.number,
};
export default HeatmapFnOItems;
