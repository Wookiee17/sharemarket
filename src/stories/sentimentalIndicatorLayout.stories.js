import SentimentIndicatorsLayout from "../containers/sentimentIndicators/sentimentIndicatorsLayout/SentimentIndicatorsLayout";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Sentiment IndicatorsLayout/Sentiment Indicators Layout",
  component: SentimentIndicatorsLayout,
};

const Template = (args) => <SentimentIndicatorsLayout {...args} />;

export const Default = {
  args: {},
};
