import React, { createRef, useState } from "react";
import dynamic from "next/dynamic";
// components
import HeatmapSidebar from "../heatmapSidebar/HeatmapSidebar";
import HeatmapAdvanceDeclineChart from "./HeatmapAdvanceDeclineChart";

// redux
import { useSelector } from "react-redux";

// const HeatmapAdvanceDeclineChart = dynamic(
//   () =>
//     import("./HeatmapAdvanceDeclineChart.fusionChartV1"),
//   { ssr: false }
// );

const HeatmapAdvanceDecline = () => {
  const theme = useSelector((state) => state.Common.theme);

  return (
    <div className={`HeatmapAdvanceDecline ${theme}`}>
      <HeatmapSidebar sliderValue={0} setLoadingState={() => {}} />
      <div className="right">
        <HeatmapAdvanceDeclineChart />
      </div>
    </div>
  );
};

export default HeatmapAdvanceDecline;
