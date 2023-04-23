import React from "react";
import { Switch } from "antd";

// icons
import { BsPinAngle } from "react-icons/bs";

// components
import SentimentIndicatorsTreeItem from "./SentimentIndicatorsTreeItem";

// redux
import { useSelector, useDispatch } from "react-redux";
import {toggleExpandAll} from "../../../../store/sentimentIndicator/SentimentIndicatorSlice";

const SentimentIndicatorsSidebar = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state) => state.Common.theme);
  const {indicators} = useSelector((state) => state.SentimentIndicator)

  return (
    <div className={`SentimentIndicatorsSidebar ${theme}`}>
      <div className="SentimentIndicatorsSidebar-header">
        <p>Indicators</p>
        <div className="row">
          <div className="row">
            <p>Expand All</p>
            <Switch 
              onChange={(checked) => dispatch(toggleExpandAll(checked))}
            />
          </div>
          <div className="bt">
            <BsPinAngle />
          </div>
        </div>
      </div>
      <div className="SentimentIndicatorsSidebar-body">
        {indicators.map((item, i) => (
          <React.Fragment key={i}>
            <SentimentIndicatorsTreeItem
              item={item}
              index={i}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SentimentIndicatorsSidebar;
