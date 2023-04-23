import React, { useState } from "react";

// çomponent
import HeatmapSidebar from "../heatmapSidebar/HeatmapSidebar";
import HeatmapNSEIndicesStocks from "./HeatmapNSEIndicesStocks";

// redux
import { useSelector } from "react-redux";

const HeatmapNSE = ({ sliderCurrent, sliderValue }) => {
  const theme = useSelector((state) => state.Common.theme);

  const [loadingState, setLoadingState] = useState(false);

  return (
    <div className={`HeatmapNSE ${theme}`}>
      <HeatmapSidebar
        sliderCurrent={sliderCurrent}
        sliderValue={sliderValue}
        setLoadingState={setLoadingState}
      />
      <div className="right">
        <HeatmapNSEIndicesStocks
          sliderCurrent={sliderCurrent}
          sliderValue={sliderValue}
          loadingState={loadingState}
        />
      </div>
    </div>
  );
};

export default HeatmapNSE;
