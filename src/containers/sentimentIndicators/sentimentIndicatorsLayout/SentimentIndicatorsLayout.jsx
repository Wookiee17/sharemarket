import React from "react";

// redux
import { useSelector } from "react-redux";

// component
import TabSection from "../../../common/component/tabSections/TabSections";
import SentimentIndicatorsSidebar from "../../../common/component/sentimentIndicators/sentimentIndicatorsSidebar/SentimentIndicatorsSidebar";
import SentimentIndicatorsBody from "../../../common/component/sentimentIndicators/sentimentIndicatorsBody/SentimentIndicatorsBody";

const SentimentIndicatorsLayout = () => {
  const theme = useSelector((state) => state.Common.theme);
  return (
    <TabSection headerLable={`Sentiment Indicators`}>
      <div className={`${theme} SentimentIndicators`}>
        <SentimentIndicatorsSidebar />
        <SentimentIndicatorsBody />
      </div>
    </TabSection>
  );
};

export default SentimentIndicatorsLayout;
