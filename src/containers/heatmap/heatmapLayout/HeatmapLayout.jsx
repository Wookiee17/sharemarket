import React, { useState } from "react";
import Slider from "rc-slider";

// redux
import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../../../store/heatmap/HeatmapSlice";

// component
import TabSection from "../../../common/component/tabSections/TabSections";
import HeatmapAdvanceDecline from "../../../common/component/heatmap/heatmapAdvanceDecline/HeatmapAdvanceDecline";
import HeatmapFnO from "../../../common/component/heatmap/heatmapFnO/HeatmapFnO";
import HeatmapNSE from "../../../common/component/heatmap/heatmapNSE/HeatmapNSE";

const HeatmapLayout = () => {
  const theme = useSelector((state) => state.Common.theme);
  const [activeTab, setActiveTab] = useState(0);
  const tab = [
    {
      id: 1,
      name: "NSE Indices",
    },
    {
      id: 2,
      name: "FnO",
    },
    {
      id: 3,
      name: "Advance Decline Ratio - Intraday  ",
    },
  ];

  return (
    <div className={`${theme} Heatmap`}>
      <div className="Heatmap_top">
        <div className="left">
          <div className={`secondary_tabs ${theme}`}>
            {tab.map((item, i) => (
              <div
                key={i}
                className={`secondary_tabs-item ${activeTab == i && "focused"}`}
                onClick={() => {
                  setActiveTab(i);
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
        {activeTab != 2 && (
        <div className="viewBy">
          <p>View By</p>
          <div className="viewBy-slider">
            <Slider
              min={0}
              defaultValue={0}
              marks={{
                0: `Today`,
                16: `1 Hour`,
                32: `1 Week`,
                48: `1 Month`,
                64: `3 Months`,
                80: `6 Months`,
                100: `1 Year`,
              }}
              step={null}
            />
          </div>
        </div>
        )}
      </div>
      <div className="Heatmap_bottom">
        <TabSection headerLable={`Heatmap`}>
          {activeTab == 0 && <HeatmapNSE />}
          {activeTab == 1 && <HeatmapFnO activeTab={activeTab} />}
          {activeTab == 2 && <HeatmapAdvanceDecline />}
        </TabSection>
      </div>
    </div>
  );
};

export default HeatmapLayout;
