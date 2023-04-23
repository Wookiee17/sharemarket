import SentimentIndicatorsBody from "../common/component/sentimentIndicators/sentimentIndicatorsBody/SentimentIndicatorsBody";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Sentiment IndicatorsLayout/Sentiment Indicators Body",
  component: SentimentIndicatorsBody,
};

const Template = (args) => <SentimentIndicatorsBody {...args} />;

export const Default = {
  args: {},
};
