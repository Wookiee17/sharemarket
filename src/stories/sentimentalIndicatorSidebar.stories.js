import SentimentIndicatorsSidebar from "../common/component/sentimentIndicators/sentimentIndicatorsSidebar/SentimentIndicatorsSidebar";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Sentiment IndicatorsLayout/Sentiment Indicators Sidebar",
  component: SentimentIndicatorsSidebar,
};

const Template = (args) => <SentimentIndicatorsSidebar {...args} />;

export const Default = {
  args: {},
};
