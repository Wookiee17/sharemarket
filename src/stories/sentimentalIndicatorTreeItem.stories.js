import SentimentIndicatorsTreeItemLevel1 from "../common/component/sentimentIndicators/sentimentIndicatorsSidebar/SentimentIndicatorsTreeItemLevel1";
// styles
import "../common/assets/styles/main.scss";

export default {
  title: "Sentiment IndicatorsLayout/Sentiment Indicators Tree ItemLevel1",
  component: SentimentIndicatorsTreeItemLevel1,
};

const Template = (args) => <SentimentIndicatorsTreeItemLevel1 {...args} />;

export const Default = {
  args: {
    title: "Level 1",
    options: [
      {
        title: "FnO Data",
        options: [
          {
            title: "OI PCR",
            options: [
              {
                title: "Client",
              },
              {
                title: "Daily Swing",
              },
            ],
          },
          {
            title: "Volume PCR",
            options: [
              {
                title: "Client",
              },
              {
                title: "Daily Swing",
              },
            ],
          },
          {
            title: "NIFTY Premiums",
            options: [
              {
                title: "Client",
              },
              {
                title: "Daily Swing",
                options: [
                  {
                    title: "Volume PCR",
                    options: [
                      {
                        title: "Client",
                      },
                      {
                        title: "Daily Swing",
                      },
                    ],
                  },
                  {
                    title: "NIFTY Premiums",
                    options: [
                      {
                        title: "Client",
                      },
                      {
                        title: "Daily Swing",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
