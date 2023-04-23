import React from "react";
import PropTypes from "prop-types";

// icons
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setActiveSidebarHeatMap } from "../../../../store/heatmap/HeatmapSlice";

const HeatmapSidebarItem = ({ positive, name, id }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Common.theme);
  return (
    <button className={`Heatmap_sidebar-item ${theme}`}>
      <h4
        onClick={() => {
          dispatch(setActiveSidebarHeatMap(id));
        }}
      >
        {name}
      </h4>
      <div className="qnt">
        {positive == true ? (
          <FiArrowUp className={`cGreen`} />
        ) : (
          <FiArrowDown className={`cRed`} />
        )}
        66666.99
      </div>
      <div className="opt">(..)</div>
    </button>
  );
};

HeatmapSidebarItem.propTypes = {
  positive: PropTypes.bool,
  name: PropTypes.string,
};

export default HeatmapSidebarItem;
